import prisma from '../db/client';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const CHAT_API_URL = 'https://api.deepseek.com/chat/completions';

export class DeepDiveService {

  public async generateReport(clusterId: string): Promise<string> {
    console.log(`Generating Deep Dive Report for Cluster ${clusterId}...`);

    // 1. Fetch Narrative Cluster & Units
    const cluster = await prisma.narrativeCluster.findUnique({
      where: { id: clusterId }
    });

    if (!cluster) throw new Error("Cluster not found");

    // CACHE CHECK: If report exists and is less than 24h old, return it
    if (cluster.report_content && cluster.report_updated_at) {
        const cacheAge = Date.now() - cluster.report_updated_at.getTime();
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 Hours
        if (cacheAge < MAX_AGE) {
            console.log("Returning Cached Deep Dive Report");
            return cluster.report_content;
        }
    }

    const unitIds = JSON.parse(cluster.unit_ids);
    const units = await prisma.narrativeUnit.findMany({
      where: { id: { in: unitIds } },
      select: { title: true, summary: true, source_type: true, timestamp: true },
      take: 30 // Limit context to avoid token overflow
    });

    if (units.length === 0) return "Insufficient data to generate report.";

    // 2. Prepare Context
    const context = units.map(u => 
      `[${u.timestamp.toISOString().split('T')[0]}] (${u.source_type}) ${u.title}: ${u.summary}`
    ).join('\n');

    const prompt = `
    你是一家顶级宏观对冲基金的高级情报分析师。
    你的任务是针对以下叙事主题写一份“深度情报研报”： "${cluster.name}"。

    上下文数据 (按时间顺序的新闻条目):
    ${context}

    ---
    
    报告要求:
    1. **语言**: 简体中文。
    2. **格式**: Markdown。
    3. **语调**: 客观、分析性、专业、深刻。拒绝废话和陈词滥调。
    4. **结构**:
       - **执行摘要 (Executive Summary)**: 3个要点总结核心情况。
       - **起源与时间线 (Origin & Timeline)**: 事件是如何开始和演变的？
       - **关键利益相关者 (Key Stakeholders)**: 主要参与者（公司、监管机构、关键人物）是谁？他们的立场是什么？
       - **冲突分析 (Conflict Analysis)**: 核心矛盾是什么？（例如：创新与监管、多头与空头）。
       - **战略展望 (Strategic Outlook)**: 接下来最可能发生什么？有哪些尾部风险？

    请立即撰写报告。
    `;

    // 3. Call DeepSeek
    if (!DEEPSEEK_API_KEY) return "API Key Missing";

    try {
        const response = await axios.post(
            CHAT_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一名专业的金融情报分析师。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.4 // Slightly higher for creative synthesis but grounded
            },
            { headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` } }
        );
        
        const content = response.data.choices?.[0]?.message?.content || "Failed to generate report.";
        
        // Save to Cache
        if (content && content.length > 100) {
            await prisma.narrativeCluster.update({
                where: { id: clusterId },
                data: {
                    report_content: content,
                    report_updated_at: new Date()
                }
            });
        }

        return content;
    } catch (error) {
        console.error("Error generating deep dive report:", error);
        return "Report generation unavailable.";
    }
  }
}

export const deepDiveService = new DeepDiveService();
