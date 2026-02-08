'use client';
import React, { useEffect, useState } from 'react';
import { GlassCard, Badge } from '@/components/ui/Glass';
import { X, Loader2, Link as LinkIcon, BarChart2 } from 'lucide-react';

interface EntityInspectorProps {
  entityName: string | null;
  onClose: () => void;
}

export const EntityInspector: React.FC<EntityInspectorProps> = ({ entityName, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityName) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/entities/${encodeURIComponent(entityName)}/analysis`);
        const result = await res.json();
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [entityName]);

  if (!entityName) return null;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-80 z-20 animate-fade-in-right">
      <GlassCard className="h-full flex flex-col border-secondary/30 shadow-2xl bg-black/90 backdrop-blur-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3 shrink-0">
            <h3 className="font-bold text-lg text-white truncate pr-2">{entityName}</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-4 h-4 text-text-muted" />
            </button>
        </div>

        {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-secondary">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs uppercase tracking-widest">Scanning Network...</span>
            </div>
        ) : !data || !data.found ? (
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm italic">
                Entity not found in active clusters.
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
                
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded bg-white/5 border border-white/5">
                        <div className="text-[10px] text-text-muted uppercase mb-1">Mentions</div>
                        <div className="text-xl font-bold text-white">{data.mentions}</div>
                    </div>
                    <div className="p-3 rounded bg-white/5 border border-white/5">
                        <div className="text-[10px] text-text-muted uppercase mb-1">Sentiment</div>
                        <div className={`text-xl font-bold ${
                            data.sentiment_bias === 'Bullish' ? 'text-success' : 
                            data.sentiment_bias === 'Bearish' ? 'text-accent' : 'text-text-muted'
                        }`}>
                            {data.sentiment_bias}
                        </div>
                    </div>
                </div>

                {/* Associated Narratives */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-secondary uppercase tracking-widest">
                        <LinkIcon className="w-3 h-3" /> Related Narratives
                    </div>
                    <div className="flex flex-col gap-2">
                        {data.narratives.map((n: any) => (
                            <div key={n.id} className="p-2 rounded bg-secondary/10 border border-secondary/20 text-xs text-white/90 hover:bg-secondary/20 transition-colors">
                                {n.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Headlines */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary uppercase tracking-widest">
                        <BarChart2 className="w-3 h-3" /> Recent Context
                    </div>
                    <div className="space-y-2">
                        {data.recent_headlines.map((title: string, i: number) => (
                            <div key={i} className="text-[11px] text-text-muted border-l-2 border-white/10 pl-2 py-1 leading-snug">
                                {title}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        )}
      </GlassCard>
    </div>
  );
};
