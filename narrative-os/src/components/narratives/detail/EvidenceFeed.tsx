'use client';

import React, { useState } from 'react';
import { ExternalLink, Database, ShieldCheck, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Evidence } from '@/types';
import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

// Helper to get source weight/icon
const getSourceInfo = (source: string) => {
  const s = source.toLowerCase();
  if (s.includes('bloomberg') || s.includes('reuters') || s.includes('times')) {
    return { icon: ShieldCheck, label: '权威媒体', weight: '高', color: 'text-brand-primary' };
  }
  if (s.includes('twitter') || s.includes('reddit')) {
    return { icon: Users, label: '社交网络', weight: '中', color: 'text-terminal-blue' };
  }
  return { icon: Globe, label: '网络资讯', weight: '低', color: 'text-terminal-light-gray' };
};

export function EvidenceFeed({ data }: { data: Evidence[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Panel 
      title="证据链追踪" 
      icon={Database}
      className="h-full"
    >
      <div className="flex flex-col h-full space-y-3 p-3">
        {data.map((item) => {
          const sourceInfo = getSourceInfo(item.source);
          const SourceIcon = sourceInfo.icon;
          const isExpanded = expandedId === item.id;
          
          return (
            <div 
              key={item.id} 
              className={cn(
                "p-4 text-xs rounded-xl glass-card cursor-pointer group animate-fade-in border border-white/5",
                isExpanded ? "bg-white/10" : "bg-white/5"
              )}
              onClick={() => toggleExpand(item.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge type="default" className="bg-white/10 border-white/10 text-foreground px-2">
                    {item.source}
                  </Badge>
                  <span className={cn("text-[10px] flex items-center gap-1 font-medium", sourceInfo.color)}>
                    <SourceIcon className="h-3 w-3" />
                    {sourceInfo.label}
                  </span>
                </div>
                <span className="text-[10px] text-terminal-light-gray">{item.timestamp}</span>
              </div>
              
              <p className={cn(
                "text-terminal-light-gray mb-3 leading-relaxed group-hover:text-foreground transition-colors font-sans",
                isExpanded ? "" : "line-clamp-2"
              )}>
                “{item.content}”
              </p>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2 items-center">
                  <Badge 
                    type={item.sentiment === 'Positive' ? 'Bullish' : item.sentiment === 'Negative' ? 'Bearish' : 'Neutral'}
                    className="px-2"
                  >
                    {item.sentiment === 'Positive' ? '正面' : item.sentiment === 'Negative' ? '负面' : '中性'}
                  </Badge>
                  {isExpanded ? <ChevronUp className="h-3 w-3 text-terminal-light-gray" /> : <ChevronDown className="h-3 w-3 text-terminal-light-gray" />}
                </div>
                
                <a 
                  href={item.url} 
                  onClick={(e) => e.stopPropagation()}
                  className="text-terminal-light-gray hover:text-brand-primary transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                >
                  查看原文 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
