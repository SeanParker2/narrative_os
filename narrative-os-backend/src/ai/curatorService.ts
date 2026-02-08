import axios from 'axios';
import prisma from '../db/client';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const CHAT_API_URL = 'https://api.deepseek.com/chat/completions';

/**
 * Curator Service
 * Acts as the "Editor-in-Chief".
 * Scans a large batch of raw headlines and selects only the most critical ones for processing.
 */
export class CuratorService {

    /**
     * Scans unprocessed RawTexts and selects the best ones.
     * @returns List of RawText IDs to process
     */
    public async curateRecentItems(): Promise<string[]> {
        console.log("[Curator] Starting curation job...");

        // 1. Fetch recent unprocessed items (last 24h)
        // We look for items that have NOT been processed into NarrativeUnits yet.
        // And strictly, we want to look at a batch.
        const unprocessed = await prisma.rawText.findMany({
            where: {
                timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                // We can't easily join on "NOT EXISTS" in Prisma efficiently without raw query or separate check
                // So we fetch latest 100 and filter in memory for MVP
            },
            orderBy: { timestamp: 'desc' },
            take: 100
        });

        // Filter out ones already in NarrativeUnit
        const processedUnits = await prisma.narrativeUnit.findMany({
            where: { raw_text_id: { in: unprocessed.map(u => u.id) } },
            select: { raw_text_id: true }
        });
        const processedIds = new Set(processedUnits.map(p => p.raw_text_id));
        
        const candidates = unprocessed.filter(u => !processedIds.has(u.id));

        if (candidates.length === 0) {
            console.log("[Curator] No new items to curate.");
            return [];
        }

        console.log(`[Curator] Reviewing ${candidates.length} candidates...`);

        // 2. Prepare Prompt
        // We send IDs and Titles.
        const listContent = candidates.map((u, index) => `${index + 1}. [ID:${u.id}] ${u.title}`).join('\n');

        const prompt = `
        你是一家顶级财经媒体的总编辑。
        以下是待审核的新闻快讯列表。你的任务是**筛选出最具市场影响力、值得深度分析的核心事件**。

        筛选标准：
        1. **重要性**：涉及宏观经济、行业巨头（如英伟达、特斯拉、腾讯）、重大政策或突发黑天鹅。
        2. **叙事性**：背后有复杂的博弈或趋势，值得写成研报。
        3. **去噪**：坚决剔除“股价常规波动”、“某公司发布无关紧要产品”、“广告软文”、“日常会议通知”。

        待审列表：
        ${listContent}

        请返回一个 JSON 对象，包含你选中的新闻 ID 列表。
        格式：
        {
            "selected_ids": ["ID:xxx", "ID:yyy"],
            "reason": "简述选择理由"
        }
        注意：仅返回 JSON，不要包含 Markdown 格式。ID 必须完全匹配列表中的格式（去除 'ID:' 前缀，只保留真实UUID）。
        `;

        // 3. Call DeepSeek
        if (!DEEPSEEK_API_KEY) {
            console.warn("[Curator] No API Key, selecting first 5 as fallback.");
            return candidates.slice(0, 5).map(c => c.id);
        }

        try {
            const response = await axios.post(
                CHAT_API_URL,
                {
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: "你是一个严格的财经新闻过滤器。只输出 JSON。" },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.1, // Strict logic
                    response_format: { type: "json_object" }
                },
                { headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` } }
            );

            const content = response.data.choices?.[0]?.message?.content;
            const result = JSON.parse(content);
            
            // Clean IDs (remove "ID:" if model hallunicated it back, though prompt said remove)
            let selectedIds: string[] = result.selected_ids || [];
            
            // Validate IDs exist in our candidate list
            const candidateIdSet = new Set(candidates.map(c => c.id));
            selectedIds = selectedIds
                .map(id => id.replace('ID:', '').trim())
                .filter(id => candidateIdSet.has(id));

            console.log(`[Curator] Selected ${selectedIds.length} items for processing. Reason: ${result.reason}`);
            return selectedIds;

        } catch (error) {
            console.error("[Curator] AI Selection failed:", error);
            // Fallback: If AI fails, maybe pick top 10% to ensure liveness?
            return candidates.slice(0, 5).map(c => c.id);
        }
    }
}

export const curatorService = new CuratorService();
