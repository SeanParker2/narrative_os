import prisma from '../db/client';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const CHAT_API_URL = 'https://api.deepseek.com/chat/completions';

export class WargameService {

  public async runSimulation(clusterId: string): Promise<any> {
    console.log(`Running Wargame Simulation for Cluster ${clusterId}...`);

    const cluster = await prisma.narrativeCluster.findUnique({
      where: { id: clusterId }
    });

    if (!cluster) throw new Error("Cluster not found");

    const prompt = `
    你正在模拟一场关于以下叙事主题的“作战室”辩论： "${cluster.name}"。
    
    角色:
    1. **多头博士 (Dr. Bull)**: 乐观的未来主义者和成长型投资者。看到的是潜力、颠覆和机会。
    2. **空头先生 (Mr. Bear)**: 愤世嫉俗的风险管理者和宏观历史学家。看到的是泡沫、监管风险和估值陷阱。
    3. **仲裁者 (Arbiter)**: 平衡的裁判，总结辩论。

    任务:
    生成一个对话脚本（4-6轮），让多头博士和空头先生就这一叙事的未来进行激辩。
    最后由仲裁者给出最终裁决。
    请使用中文。

    输出 JSON 格式:
    {
      "turns": [
        { "speaker": "Dr. Bull", "content": "..." },
        { "speaker": "Mr. Bear", "content": "..." }
      ],
      "verdict": "..."
    }
    `;

    try {
        const response = await axios.post(
            CHAT_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一个模拟引擎。仅输出 JSON。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7, // Higher temp for creative dialogue
                response_format: { type: "json_object" }
            },
            { headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` } }
        );
        
        const content = response.data.choices?.[0]?.message?.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Wargame simulation failed:", error);
        return { turns: [], verdict: "Simulation Failed" };
    }
  }
}

export const wargameService = new WargameService();
