import React from 'react';
import { NarrativeFilters } from '@/components/narratives/list/NarrativeFilters';
import { NarrativeTable } from '@/components/narratives/list/NarrativeTable';

async function getNarratives() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/narratives`, { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('获取叙事数据失败');
  }
  
  return res.json();
}

export default async function NarrativesPage() {
  const narratives = await getNarratives();

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between border-b border-terminal-medium-gray pb-2 shrink-0">
        <h1 className="text-xl font-bold text-terminal-green font-mono uppercase tracking-wider">
          全部叙事
        </h1>
        <div className="text-xs font-mono text-terminal-light-gray">
          总计跟踪：{narratives.length}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <NarrativeFilters />
        <div className="flex-1 min-h-0 overflow-auto">
           <NarrativeTable data={narratives} />
        </div>
      </div>
    </div>
  );
}
