'use client';

import React from 'react';
import Link from 'next/link';
import { Swords } from 'lucide-react';
import { NarrativeDetail } from '@/types';
import { Panel } from '@/components/ui/Panel';

export function CompetingNarratives({ data }: { data: NarrativeDetail['competitors'] }) {
  return (
    <Panel 
      title="竞争叙事" 
      icon={Swords}
      className="h-full"
    >
      <div className="flex flex-col h-full divide-y divide-terminal-medium-gray">
        {data.map((comp, i) => (
          <div key={i} className="flex justify-between items-center p-3 hover:bg-terminal-medium-gray/30 transition-colors">
            <Link href="#" className="text-xs font-bold hover:text-terminal-red transition-colors text-foreground">
              {comp.name}
            </Link>
            <div className="text-[10px] text-terminal-light-gray font-mono text-right flex flex-col items-end">
              <div>强度：{comp.strength}</div>
              <div className="text-terminal-red">相关性：{comp.correlation}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
