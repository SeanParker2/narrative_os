export type Trend = 'up' | 'down' | 'stable';
export type Lifecycle = 'Emerging' | 'Hyped' | 'Consensus' | 'Fading';
export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';
export type SentimentDetail = 'Positive' | 'Negative' | 'Neutral';

export interface Narrative {
  id: string;
  name: string;
  strength: number; // 0-100
  trend: Trend;
  lifecycle: Lifecycle;
  sources_count: number;
  sentiment: Sentiment;
  divergence: number; // 0-100
  market: string;
  industry: string;
  created_at: string;
  description?: string;
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
  sentiment: SentimentDetail;
  url: string;
}

export interface GraphNode {
  id: string;
  name: string;
  value: number;
  category: Lifecycle;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface NarrativeDetail extends Narrative {
  timeline: TimelineEvent[];
  evidence: Evidence[];
  relations: GraphData;
  competitors: { name: string; strength: number; correlation: number }[];
  radar_data: {
    volume: number;
    velocity: number;
    reach: number;
    engagement: number;
    credibility: number;
    persistence: number;
  };
}
