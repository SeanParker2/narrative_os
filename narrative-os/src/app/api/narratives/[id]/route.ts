import { NextResponse } from 'next/server';
import { mockNarratives, mockTimelineData, mockEvidence, mockGraphNodes, mockGraphLinks } from '@/services/mockData';
import { NarrativeDetail } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const narrative = mockNarratives.find((n) => n.id === id);

  if (!narrative) {
    return NextResponse.json({ error: '未找到叙事' }, { status: 404 });
  }

  const lifecycleLabelMap: Record<string, string> = {
    Emerging: '萌芽',
    Hyped: '热潮',
    Consensus: '共识',
    Fading: '衰退'
  };

  const trendLabelMap: Record<string, string> = {
    up: '上行',
    down: '下行',
    stable: '稳定'
  };

  const sentimentLabelMap: Record<string, string> = {
    Bullish: '看多',
    Bearish: '看空',
    Neutral: '中性'
  };

  const lifecycleLabel = lifecycleLabelMap[narrative.lifecycle] ?? narrative.lifecycle;
  const trendLabel = trendLabelMap[narrative.trend] ?? narrative.trend;
  const sentimentLabel = sentimentLabelMap[narrative.sentiment] ?? narrative.sentiment;

  const detail: NarrativeDetail = {
    ...narrative,
    description: `“${narrative.name}”当前处于${lifecycleLabel}阶段。核心指标显示${trendLabel}动能，市场情绪为${sentimentLabel}。`,
    timeline: mockTimelineData,
    evidence: mockEvidence,
    relations: {
      nodes: mockGraphNodes,
      links: mockGraphLinks,
    },
    competitors: [
      { name: '传统资管机构', strength: 88, correlation: -0.4 },
      { name: '中心化 AI 模型', strength: 92, correlation: -0.7 },
    ],
    radar_data: {
      volume: 90,
      velocity: 85,
      reach: 70,
      engagement: 95,
      credibility: 60,
      persistence: 80,
    }
  };

  return NextResponse.json(detail);
}
