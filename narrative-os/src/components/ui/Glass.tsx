import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover';
}

export const GlassCard: React.FC<GlassCardProps> = ({ className, variant = 'default', children, ...props }) => {
  return (
    <div 
      className={cn(
        "glass-panel rounded-xl p-4 transition-all duration-300",
        variant === 'hover' && "glass-panel-hover",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'primary' | 'secondary' | 'accent' | 'success', className?: string }> = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-success/10 text-success border-success/20",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-mono-tech border backdrop-blur-sm", variants[variant], className)}>
      {children}
    </span>
  );
};

export const SectionHeader: React.FC<{ title: string, icon?: React.ReactNode }> = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-4 text-text-muted uppercase tracking-widest text-xs font-bold">
        {icon && <span className="text-primary">{icon}</span>}
        {title}
    </div>
);
