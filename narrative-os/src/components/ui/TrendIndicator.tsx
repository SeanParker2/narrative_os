import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Trend } from '@/types';

interface Props {
  trend: Trend;
  className?: string;
  showIcon?: boolean;
}

export function TrendIndicator({ trend, className, showIcon = true }: Props) {
  const color = 
    trend === 'up' ? "text-terminal-green" : 
    trend === 'down' ? "text-terminal-red" : 
    "text-terminal-light-gray";

  return (
    <div className={cn("inline-flex items-center gap-1 font-mono", color, className)}>
      {showIcon && (
        <>
          {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
          {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
          {trend === 'stable' && <Minus className="h-3 w-3" />}
        </>
      )}
      <span className="uppercase text-xs">{trend}</span>
    </div>
  );
}
