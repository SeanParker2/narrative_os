'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import { NarrativeDetail } from '@/types';
import { Panel } from '@/components/ui/Panel';

export function NarrativeSummary({ narrative }: { narrative: NarrativeDetail }) {
  return (
    <Panel 
      title="AI 智能摘要" 
      icon={Bot}
      className="bg-terminal-blue/5 border-terminal-blue/10"
    >
      <div className="p-5 text-sm font-sans leading-relaxed text-terminal-light-gray">
        <p className="mb-3 text-foreground/90">
          {narrative.description}
        </p>
        <p>
          <span className="text-terminal-blue font-medium">核心驱动因素：</span> 机构兴趣正在上升，与近期监管透明度提高呈正相关。
          散户情绪依然复杂，但显示出明显的积累迹象。
        </p>
        {narrative.divergence > 50 && (
           <div className="mt-4 bg-terminal-amber/10 border border-terminal-amber/20 rounded-lg p-3 text-xs text-terminal-amber flex items-start gap-2">
             <span className="font-bold">⚠️</span>
             <p>警告：检测到价格走势与社交声量之间存在显著背离 ({narrative.divergence}%)。</p>
           </div>
        )}
      </div>
    </Panel>
  );
}
