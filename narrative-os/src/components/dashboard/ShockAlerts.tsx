'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Alert } from '@/types';
import { Panel } from '@/components/ui/Panel';
import { cn } from '@/utils/cn';

export function ShockAlerts({ data }: { data: Alert[] }) {
  const alerts = data.slice(0, 5);

  return (
    <Panel 
      title="市场冲击告警" 
      icon={Zap} 
      variant="alert"
      className="h-full border-terminal-red/10"
    >
      <div className="flex flex-col h-full p-2 space-y-2">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className="p-3 text-xs rounded-lg glass-card relative overflow-hidden group animate-fade-in"
          >
            {/* Red flash effect on high severity */}
            {alert.severity === 'High' && (
               <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-terminal-red/60 animate-pulse-soft"></div>
            )}
            
            <div className="flex justify-between items-center mb-1.5 pl-2">
              <span className={cn(
                "font-medium uppercase tracking-wide",
                alert.severity === 'High' ? "text-terminal-red" :
                alert.severity === 'Medium' ? "text-terminal-amber" :
                "text-terminal-blue"
              )}>
                {alert.type === 'Shock' ? '冲击' : alert.type === 'Divergence' ? '分歧' : '趋势'}
              </span>
              <span className="text-terminal-light-gray text-[10px]">{alert.timestamp}</span>
            </div>
            
            <Link href={`/narratives/detail/${alert.narrative_id}`} className="block mb-1 pl-2 font-medium text-foreground hover:text-brand-primary transition-colors truncate text-sm">
              {alert.narrative_name.split(' (')[0]}
            </Link>
            
            <p className="text-terminal-light-gray leading-tight pl-2 opacity-80 group-hover:opacity-100 transition-opacity">
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
