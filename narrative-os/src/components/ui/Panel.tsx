import React from 'react';
import { cn } from '@/utils/cn';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ElementType;
  rightContent?: React.ReactNode;
  variant?: 'default' | 'alert';
}

export function Panel({ 
  title, 
  icon: Icon, 
  rightContent, 
  children, 
  className,
  variant = 'default',
  ...props 
}: PanelProps) {
  return (
    <div 
      className={cn(
        "flex flex-col overflow-hidden rounded-md transition-all duration-300 animate-fade-in",
        variant === 'default' ? "glass-panel" : "bg-terminal-red/5 backdrop-blur-xl border border-terminal-red/20 shadow-lg",
        className
      )} 
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
          <h3 className={cn(
            "text-xs font-medium uppercase tracking-wide flex items-center gap-2",
            variant === 'default' ? "text-terminal-light-gray" : "text-terminal-red"
          )}>
            {Icon && <Icon className="h-3.5 w-3.5 opacity-70" />}
            {title}
          </h3>
          {rightContent}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}
