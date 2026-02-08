'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { NarrativeDetail } from '@/types';
import { Badge } from '@/components/ui/Badge';

const lifecycleLabelMap: Record<string, string> = {
  Emerging: '萌芽',
  Hyped: '热潮',
  Consensus: '共识',
  Fading: '衰退'
};

const getLifecycleLabel = (value?: string) => lifecycleLabelMap[value ?? ''] ?? value ?? '';

export function NarrativeHeader({ narrative }: { narrative: NarrativeDetail }) {
  return (
    <div className="glass-panel p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge type="default" className="text-[10px] px-1.5 py-0.5 uppercase tracking-wide border-terminal-cyan/30 text-terminal-cyan bg-terminal-cyan/10">
            {narrative.market}
          </Badge>
          <span className="text-xs text-terminal-light-gray font-medium">
            / {narrative.industry}
          </span>
        </div>
        <h1 className="text-3xl font-light text-foreground tracking-tight mb-3">
          {narrative.name.split(' (')[0]}
        </h1>
        <div className="flex items-center gap-4 text-xs text-terminal-light-gray font-medium">
          <span>ID: {narrative.id}</span>
          <span>创建时间: {narrative.created_at}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="min-w-[120px] bg-white/5 rounded-xl p-3 text-center border border-white/5 backdrop-blur-md">
            <div className="text-[10px] text-terminal-light-gray uppercase font-semibold mb-1">强度指数</div>
            <div className="text-2xl font-light text-brand-primary flex items-center justify-center gap-1">
              {narrative.strength}
              {narrative.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
              {narrative.trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
              {narrative.trend === 'stable' && <Minus className="h-4 w-4" />}
            </div>
        </div>

        <div className="min-w-[120px] bg-white/5 rounded-xl p-3 text-center border border-white/5 backdrop-blur-md">
             <div className="text-[10px] text-terminal-light-gray uppercase font-semibold mb-2">市场情绪</div>
             <Badge type={narrative.sentiment} variant="solid" className="px-3">
               {narrative.sentiment === 'Bullish' ? '看多' : narrative.sentiment === 'Bearish' ? '看空' : '中性'}
             </Badge>
        </div>

        <div className="min-w-[120px] bg-white/5 rounded-xl p-3 text-center border border-white/5 backdrop-blur-md">
            <div className="text-[10px] text-terminal-light-gray uppercase font-semibold mb-2">生命周期</div>
            <Badge type={narrative.lifecycle} className="px-3">
              {getLifecycleLabel(narrative.lifecycle)}
            </Badge>
        </div>
      </div>
    </div>
  );
}
