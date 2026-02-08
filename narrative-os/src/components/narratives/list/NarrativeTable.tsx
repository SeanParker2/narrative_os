'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Narrative } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { TrendIndicator } from '@/components/ui/TrendIndicator';
import { cn } from '@/utils/cn';

const lifecycleLabelMap: Record<string, string> = {
  Emerging: '萌芽',
  Hyped: '热潮',
  Consensus: '共识',
  Fading: '衰退'
};

const getLifecycleLabel = (value?: string) => lifecycleLabelMap[value ?? ''] ?? value ?? '';

export function NarrativeTable({ data }: { data: Narrative[] }) {
  return (
    <div className="overflow-x-auto border border-white/5 bg-terminal-dark-gray/40 backdrop-blur-xl rounded-xl shadow-sm animate-fade-in">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-terminal-light-gray font-medium uppercase text-[10px] tracking-wider border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
          <tr>
            <th className="px-6 py-3 font-normal cursor-pointer hover:text-foreground transition-colors group">
              <div className="flex items-center gap-1">
                叙事名称
                <ChevronsUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
              </div>
            </th>
            <th className="px-6 py-3 font-normal text-right cursor-pointer hover:text-foreground transition-colors group">
              <div className="flex items-center justify-end gap-1">
                强度指数
                <ChevronDown className="h-3 w-3 text-brand-primary" />
              </div>
            </th>
            <th className="px-6 py-3 font-normal text-center">趋势</th>
            <th className="px-6 py-3 font-normal text-center">生命周期</th>
            <th className="px-6 py-3 font-normal text-right">来源数</th>
            <th className="px-6 py-3 font-normal text-center">情绪倾向</th>
            <th className="px-6 py-3 font-normal text-right">分歧度</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-xs font-sans">
          {data.map((narrative) => (
            <tr key={narrative.id} className="group hover:bg-white/5 transition-colors h-[48px]">
              <td className="px-6 py-0 align-middle">
                <Link href={`/narratives/detail/${narrative.id}`} className="block py-2">
                  <div className="font-medium text-foreground group-hover:text-brand-primary transition-colors text-sm mb-0.5">
                    {narrative.name.split(' (')[0]}
                  </div>
                  <div className="text-[10px] text-terminal-light-gray tracking-tight flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-terminal-light-gray"></span>
                    {narrative.market} / {narrative.industry}
                  </div>
                </Link>
              </td>
              <td className="px-6 py-0 align-middle text-right">
                <span className="font-light text-foreground text-sm">{narrative.strength}</span>
              </td>
              <td className="px-6 py-0 align-middle text-center">
                <TrendIndicator trend={narrative.trend} className="justify-center" />
              </td>
              <td className="px-6 py-0 align-middle text-center">
                <Badge type={narrative.lifecycle}>{getLifecycleLabel(narrative.lifecycle)}</Badge>
              </td>
              <td className="px-6 py-0 align-middle text-right text-terminal-light-gray">
                {narrative.sources_count.toLocaleString()}
              </td>
              <td className="px-6 py-0 align-middle text-center">
                 <Badge type={narrative.sentiment} variant="solid" className="w-16 justify-center">
                    {narrative.sentiment === 'Bullish' ? '看多' : narrative.sentiment === 'Bearish' ? '看空' : '中性'}
                 </Badge>
              </td>
              <td className="px-6 py-0 align-middle text-right font-medium">
                <span className={cn(
                  narrative.divergence > 50 ? "text-brand-accent animate-pulse-soft" : "text-terminal-light-gray"
                )}>
                  {narrative.divergence}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
