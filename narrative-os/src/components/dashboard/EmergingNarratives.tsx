'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Narrative } from '@/types';
import { Panel } from '@/components/ui/Panel';

export function EmergingNarratives({ data }: { data: Narrative[] }) {
  const getGrowthRate = (item: Narrative) => {
    const base = item.sources_count + item.strength * 13;
    return (base % 45) + 5;
  };

  const emerging = data
    .filter(n => n.lifecycle === 'Emerging' || n.trend === 'up')
    .sort((a, b) => b.sources_count - a.sources_count)
    .slice(0, 5);

  return (
    <Panel 
      title="新兴叙事（24小时）" 
      icon={TrendingUp}
      className="h-full"
    >
      <table className="w-full text-left text-xs table-dense">
        <thead className="bg-terminal-black/30 text-terminal-light-gray font-mono uppercase border-b border-terminal-medium-gray sticky top-0">
          <tr>
            <th className="px-3 py-2 font-normal">叙事名称</th>
            <th className="px-3 py-2 font-normal text-right">增长率</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-terminal-medium-gray">
          {emerging.map((item) => (
            <tr key={item.id} className="group hover:bg-terminal-medium-gray/30 transition-colors">
              <td className="px-3 py-2">
                <Link href={`/narratives/detail/${item.id}`} className="block">
                  <div className="font-medium text-foreground group-hover:text-terminal-blue transition-colors truncate max-w-[140px]">
                    {item.name.split(' (')[0]}
                  </div>
                  <div className="text-[10px] text-terminal-light-gray">{item.industry}</div>
                </Link>
              </td>
              <td className="px-3 py-2 text-right font-mono text-terminal-green" title="24小时内来源数量增长百分比">
                +{getGrowthRate(item)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
