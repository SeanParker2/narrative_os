import prisma from '../db/client';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const CHAT_API_URL = 'https://api.deepseek.com/chat/completions';

export class BriefingService {

  public async generateDailyBriefing(): Promise<string> {
    console.log("Generating Periodic Market Briefing...");
    
    // determine current phase based on hour
    const hour = new Date().getHours();
    let phase = "每日更新";
    if (hour < 10) phase = "早报 (Morning Call)";
    else if (hour < 14) phase = "午间复盘 (Midday Review)";
    else if (hour < 18) phase = "收盘分析 (Market Close)";
    else phase = "盘前展望 (Pre-Market)";

    // 1. Fetch Top 5 Clusters by recent activity (approximated by unit count in last 6h)
    const clusters = await prisma.narrativeCluster.findMany({
      take: 5,
      orderBy: { id: 'desc' } // Approximation for 'most recent' since we just created them
    });

    if (clusters.length === 0) {
      return "数据不足，无法生成简报。";
    }

    // 2. Prepare Context for AI
    const clusterSummaries = clusters.map(c => `- **${c.name}**: ${c.description}`).join('\n');

    const prompt = `
    你是一位首席市场策略师，正在撰写一份 "${phase}"。
    基于以下当前主导市场的关键叙事聚类，写一份简洁、专业的市场展望。
    
    当前叙事:
    ${clusterSummaries}

    要求:
    - 标题: "全球市场叙事简报: ${phase}"
    - 语言: 简体中文。
    - 语调: 专业、深刻、前瞻性（类似财新或彭博中文版风格）。
    - 结构:
      1. **宏观视角**: 用2句话总结整体市场情绪。
      2. **关键驱动因素**: 简要分析前2-3个叙事及其影响。
      3. **战略展望**: 投资者接下来应该关注什么？
    - 格式: Markdown。字数控制在 300 字以内。
    `;

    // 3. Call DeepSeek
    if (!DEEPSEEK_API_KEY) return "API Key Missing";

    try {
        const response = await axios.post(
            CHAT_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一名资深金融分析师。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            },
            { headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` } }
        );
        
        return response.data.choices?.[0]?.message?.content || "Failed to generate briefing.";
    } catch (error) {
        console.error("Error generating briefing:", error);
        return "Briefing generation unavailable.";
    }
  }
}

export const briefingService = new BriefingService();
