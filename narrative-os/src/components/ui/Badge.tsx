import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  type?: string; // Can be lifecycle, sentiment, or generic
  variant?: 'outline' | 'solid';
  className?: string;
}

const getBadgeStyle = (type?: string, variant: 'outline' | 'solid' = 'outline') => {
  const t = type?.toLowerCase() || '';
  
  // Lifecycle colors
  if (t === 'emerging') return variant === 'solid' ? 'bg-lifecycle-emerging text-white' : 'bg-lifecycle-emerging/15 text-lifecycle-emerging border-lifecycle-emerging/20';
  if (t === 'hyped') return variant === 'solid' ? 'bg-lifecycle-hyped text-white' : 'bg-lifecycle-hyped/15 text-lifecycle-hyped border-lifecycle-hyped/20';
  if (t === 'consensus') return variant === 'solid' ? 'bg-lifecycle-consensus text-white' : 'bg-lifecycle-consensus/15 text-lifecycle-consensus border-lifecycle-consensus/20';
  if (t === 'fading') return variant === 'solid' ? 'bg-lifecycle-fading text-white' : 'bg-lifecycle-fading/15 text-lifecycle-fading border-lifecycle-fading/20';
  
  // Sentiment colors
  if (t === 'bullish' || t === 'positive') return variant === 'solid' ? 'bg-sentiment-bullish text-white' : 'bg-sentiment-bullish/15 text-sentiment-bullish border-sentiment-bullish/20';
  if (t === 'bearish' || t === 'negative') return variant === 'solid' ? 'bg-sentiment-bearish text-white' : 'bg-sentiment-bearish/15 text-sentiment-bearish border-sentiment-bearish/20';
  if (t === 'neutral') return variant === 'solid' ? 'bg-sentiment-neutral text-white' : 'bg-sentiment-neutral/15 text-sentiment-neutral border-sentiment-neutral/20';
  
  // Default
  return variant === 'solid' ? 'bg-terminal-light-gray text-white' : 'bg-terminal-light-gray/15 text-terminal-light-gray border-terminal-light-gray/20';
};

export function Badge({ children, type, variant = 'outline', className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide transition-colors duration-200 border border-transparent",
      getBadgeStyle(type, variant),
      className
    )}>
      {children}
    </span>
  );
}
