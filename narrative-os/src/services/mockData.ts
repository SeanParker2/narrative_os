
export interface Narrative {
  id: string;
  name: string;
  strength: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  lifecycle: 'Emerging' | 'Hyped' | 'Consensus' | 'Fading';
  sources_count: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  divergence: number; // 0-100
  market: string;
  industry: string;
  created_at: string;
}

export interface Alert {
  id: string;
  type: 'Shock' | 'Divergence' | 'Trend';
  narrative_id: string;
  narrative_name: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
}

export interface TimelineEvent {
  date: string;
  value: number;
  sentiment: number;
  event?: string;
}

export interface Evidence {
  id: string;
  source: string;
  content: string;
  timestamp: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  url: string;
}

// Mock Data
export const mockNarratives: Narrative[] = [
  {
    id: 'n1',
    name: 'AI 代理经济',
    strength: 92,
    trend: 'up',
    lifecycle: 'Hyped',
    sources_count: 1450,
    sentiment: 'Bullish',
    divergence: 65,
    market: '加密货币',
    industry: '人工智能',
    created_at: '2025-10-15',
  },
  {
    id: 'n2',
    name: '去中心化科学',
    strength: 78,
    trend: 'up',
    lifecycle: 'Emerging',
    sources_count: 320,
    sentiment: 'Bullish',
    divergence: 40,
    market: '加密货币',
    industry: '科学',
    created_at: '2025-11-01',
  },
  {
    id: 'n3',
    name: '消费硬件复兴',
    strength: 85,
    trend: 'stable',
    lifecycle: 'Consensus',
    sources_count: 890,
    sentiment: 'Neutral',
    divergence: 20,
    market: '科技股',
    industry: '硬件',
    created_at: '2025-08-20',
  },
  {
    id: 'n4',
    name: '生物黑客协议',
    strength: 65,
    trend: 'down',
    lifecycle: 'Fading',
    sources_count: 450,
    sentiment: 'Bearish',
    divergence: 80,
    market: '健康',
    industry: '生物科技',
    created_at: '2025-06-10',
  },
  {
    id: 'n5',
    name: '量子加密标准',
    strength: 88,
    trend: 'up',
    lifecycle: 'Emerging',
    sources_count: 210,
    sentiment: 'Neutral',
    divergence: 35,
    market: '科技股',
    industry: '安全',
    created_at: '2026-01-05',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'Shock',
    narrative_id: 'n1',
    narrative_name: 'AI 代理经济',
    severity: 'High',
    message: '检测到提及量突然飙升 (+400%)。',
    timestamp: '10 分钟前',
  },
  {
    id: 'a2',
    type: 'Divergence',
    narrative_id: 'n4',
    narrative_name: '生物黑客协议',
    severity: 'Medium',
    message: '社交情绪与媒体情绪出现严重背离。',
    timestamp: '2 小时前',
  },
  {
    id: 'a3',
    type: 'Trend',
    narrative_id: 'n2',
    narrative_name: '去中心化科学',
    severity: 'Low',
    message: '正式进入“热潮”阶段。',
    timestamp: '5 小时前',
  },
];

export const mockTimelineData: TimelineEvent[] = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-01-${i + 1}`,
  value: Math.floor(Math.random() * 50) + 50,
  sentiment: Math.random() * 2 - 1,
  event: i % 7 === 0 ? `关键事件 ${Math.floor(i / 7) + 1}` : undefined,
}));

export const mockEvidence: Evidence[] = [
  {
    id: 'e1',
    source: 'Twitter',
    content: '新的 AI 代理完全改变了我们处理 DeFi 交易的方式。这简直太疯狂了。',
    timestamp: '2026-02-06 09:30',
    sentiment: 'Positive',
    url: '#',
  },
  {
    id: 'e2',
    source: 'Bloomberg',
    content: '随着自主代理开始管理大量资金，监管担忧日益增加。',
    timestamp: '2026-02-06 08:15',
    sentiment: 'Negative',
    url: '#',
  },
  {
    id: 'e3',
    source: 'Reddit',
    content: '深入挖掘最新协议。这是我发现的内容...',
    timestamp: '2026-02-05 22:00',
    sentiment: 'Neutral',
    url: '#',
  },
];

export const mockGraphNodes = mockNarratives.map(n => ({
  id: n.id,
  name: n.name.split(' ')[0], // 简短名称
  value: n.strength,
  category: n.lifecycle,
}));

export const mockGraphLinks = [
  { source: 'n1', target: 'n2', value: 5 },
  { source: 'n1', target: 'n5', value: 3 },
  { source: 'n3', target: 'n4', value: 2 },
  { source: 'n2', target: 'n4', value: 1 },
];
