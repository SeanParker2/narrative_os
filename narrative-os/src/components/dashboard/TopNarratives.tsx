'use client';
import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/Glass';
import { ReportModal } from './ReportModal';
import { Sparkline } from '@/components/ui/Sparkline';

interface NarrativeDataGridProps {
  data: any[];
}

export function TopNarratives({ data }: NarrativeDataGridProps) {
  const [sortField, setSortField] = useState<'strength' | 'sources_count'>('strength');
  const [selectedNarrative, setSelectedNarrative] = useState<{id: string, name: string} | null>(null);

  const sortedData = [...data].sort((a, b) => b[sortField] - a[sortField]).slice(0, 8);

  // Mock Sparkline Data Generator (Since we don't fetch full history in list view yet)
  // In production, backend should return `history: number[]` in the list API
  const getMockHistory = (strength: number) => {
      return Array.from({ length: 10 }, (_, i) => ({
          value: Math.max(0, strength - Math.random() * 20 + i * 2)
      }));
  };

  const getHistoryData = (narrative: any) => {
      if (narrative.history && Array.isArray(narrative.history) && narrative.history.length > 0) {
          return narrative.history;
      }
      return getMockHistory(narrative.strength);
  };

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 text-[10px] uppercase text-text-muted font-bold tracking-wider border-b border-white/5">
            <div className="flex gap-4">
                <span className="w-8 text-center">#</span>
                <span>Narrative</span>
            </div>
            <div className="flex gap-6 pr-2">
                <span className="w-16 text-center">Trend (7d)</span>
                <button onClick={() => setSortField('strength')} className="flex items-center gap-1 hover:text-white transition-colors">
                    Strength <ArrowUpDown className="w-3 h-3" />
                </button>
            </div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 mt-1">
            {sortedData.map((narrative, index) => (
            <div 
                key={narrative.id} 
                onClick={() => setSelectedNarrative({ id: narrative.id, name: narrative.name })}
                className="group flex items-center justify-between p-3 rounded bg-white/5 border border-transparent hover:bg-white/10 hover:border-primary/20 transition-all cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-white/20 group-hover:text-primary font-mono w-8 text-center">
                        {index + 1}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-text-main group-hover:text-white transition-colors line-clamp-1">
                            {narrative.name}
                        </div>
                        <div className="flex gap-2 mt-1">
                            <Badge variant={narrative.lifecycle === 'Hyped' ? 'accent' : 'secondary'} className="text-[9px] py-0 px-1.5 h-4">
                                {narrative.lifecycle}
                            </Badge>
                            <span className="text-[10px] text-text-muted flex items-center gap-1">
                                {narrative.sources_count} sources
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Sparkline */}
                    <div className="w-16 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Sparkline data={getHistoryData(narrative)} color={narrative.trend === 'up' ? '#10b981' : '#f43f5e'} height={30} />
                    </div>

                    {/* Strength Score */}
                    <div className="text-right w-12">
                        <div className="text-base font-bold text-white font-mono leading-none">
                            {narrative.strength}
                        </div>
                        <div className={`flex items-center justify-end gap-1 text-[9px] mt-0.5 ${
                            narrative.trend === 'up' ? 'text-success' : narrative.trend === 'down' ? 'text-accent' : 'text-text-muted'
                        }`}>
                            {narrative.trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : 
                             narrative.trend === 'down' ? <ArrowDownRight className="w-2.5 h-2.5" /> : 
                             <Minus className="w-2.5 h-2.5" />}
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </div>

      {/* Deep Dive Modal */}
      {selectedNarrative && (
        <ReportModal 
          narrativeId={selectedNarrative.id} 
          narrativeName={selectedNarrative.name} 
          onClose={() => setSelectedNarrative(null)} 
        />
      )}
    </>
  );
}
