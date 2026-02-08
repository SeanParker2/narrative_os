import axios from 'axios';
import prisma from '../db/client';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const CHAT_API_URL = 'https://api.deepseek.com/chat/completions';

/**
 * ResearchAgent
 * Performs multi-turn autonomous analysis on narrative clusters.
 */
export class ResearchAgent {

    /**
     * Conducts a multi-turn interview with DeepSeek about a specific cluster
     */
    public async conductDeepResearch(clusterId: string) {
        console.log(`[ResearchAgent] Starting deep research for cluster: ${clusterId}`);

        const cluster = await prisma.narrativeCluster.findUnique({
            where: { id: clusterId }
        });
        if (!cluster) return;

        // Fetch recent headlines for context
        const unitIds = JSON.parse(cluster.unit_ids);
        const units = await prisma.narrativeUnit.findMany({
            where: { id: { in: unitIds } },
            take: 20
        });
        const context = units.map(u => `- ${u.title}`).join('\n');

        // Initial System Prompt
        const messages = [
            { 
                role: "system", 
                content: "你是一名专业的金融情报分析专家（Research Agent）。你的目标是通过严谨、多步骤的辩证过程来分析市场叙事。请不要只是总结；你需要调查、质疑并综合信息。请始终使用中文（简体）进行回复，保持专业、客观、犀利的语调。" 
            },
            {
                role: "user",
                content: `以下是关于叙事主题 "${cluster.name}" 的原始数据：\n${context}\n\n步骤 1: 请找出该叙事中唯一最关键的“冲突”或“张力”点。利益攸关方是什么？核心矛盾在哪里？`
            }
        ];

        try {
            // TURN 1: Identify Conflict
            console.log(`[ResearchAgent] Turn 1: Identifying Conflict...`);
            const response1 = await this.callDeepSeek(messages);
            messages.push({ role: "assistant", content: response1 });

            // TURN 2: Stakeholder Analysis
            console.log(`[ResearchAgent] Turn 2: Stakeholder Analysis...`);
            messages.push({ 
                role: "user", 
                content: "步骤 2: 谁是推动这一事件的关键参与者（机构、国家、巨鲸玩家）？他们背后隐藏的动机是什么？" 
            });
            const response2 = await this.callDeepSeek(messages);
            messages.push({ role: "assistant", content: response2 });

            // TURN 3: Contrarian View / Wargame
            console.log(`[ResearchAgent] Turn 3: Contrarian Check...`);
            messages.push({ 
                role: "user", 
                content: "步骤 3: 扮演“魔鬼代言人”。市场共识忽略了什么？这里是否存在“黑天鹅”风险或反转的可能性？" 
            });
            const response3 = await this.callDeepSeek(messages);
            messages.push({ role: "assistant", content: response3 });

            // TURN 4: Synthesis
            console.log(`[ResearchAgent] Turn 4: Final Synthesis...`);
            messages.push({ 
                role: "user", 
                content: "最终步骤: 将上述所有分析整合成一份连贯的《深度情报研报》。使用 Markdown 格式。章节包括：[核心冲突]、[幕后推手与动机]、[逆向思维与风险]、[战略研判]。请确保行文流畅，像一份顶级投行的内部备忘录。" 
            });
            const finalReport = await this.callDeepSeek(messages);

            // Save Result
            await prisma.narrativeCluster.update({
                where: { id: clusterId },
                data: {
                    report_content: finalReport,
                    report_updated_at: new Date()
                }
            });

            console.log(`[ResearchAgent] Research Complete for ${cluster.name}`);
            return finalReport;

        } catch (error) {
            console.error("[ResearchAgent] Failed:", error);
            return null;
        }
    }

    private async callDeepSeek(messages: any[]): Promise<string> {
        if (!DEEPSEEK_API_KEY) {
            console.warn("[ResearchAgent] No API Key, returning mock response.");
            return "Simulated AI Response (API Key Missing)";
        }

        try {
            const response = await axios.post(
                CHAT_API_URL,
                {
                    model: "deepseek-chat",
                    messages: messages,
                    temperature: 0.5, // Balanced creativity
                    max_tokens: 1000
                },
                { headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` } }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("DeepSeek API Call Failed:", error);
            throw error;
        }
    }
}

export const researchAgent = new ResearchAgent();
