'use client';

import React from 'react';
import { Search } from 'lucide-react';

export function NarrativeFilters() {
  return (
    <div className="flex flex-col gap-4 border border-terminal-medium-gray bg-terminal-dark-gray p-3 rounded-md lg:flex-row lg:items-center lg:justify-between shadow-sm">
      <div className="flex flex-wrap gap-2">
        {/* Market Filter */}
        <select className="bg-terminal-black border border-terminal-medium-gray text-terminal-light-gray text-xs rounded-sm px-3 py-1.5 focus:border-brand-primary focus:outline-none cursor-pointer hover:border-terminal-light-gray transition-colors font-mono">
          <option>所有市场</option>
          <option>加密货币</option>
          <option>科技股</option>
          <option>外汇</option>
        </select>

        {/* Industry Filter */}
        <select className="bg-terminal-black border border-terminal-medium-gray text-terminal-light-gray text-xs rounded-sm px-3 py-1.5 focus:border-brand-primary focus:outline-none cursor-pointer hover:border-terminal-light-gray transition-colors font-mono">
          <option>所有行业</option>
          <option>人工智能</option>
          <option>生物科技</option>
          <option>清洁能源</option>
        </select>

        {/* Lifecycle Filter */}
        <select className="bg-terminal-black border border-terminal-medium-gray text-terminal-light-gray text-xs rounded-sm px-3 py-1.5 focus:border-brand-primary focus:outline-none cursor-pointer hover:border-terminal-light-gray transition-colors font-mono">
          <option>所有阶段</option>
          <option>萌芽</option>
          <option>热潮</option>
          <option>共识</option>
          <option>衰退</option>
        </select>
        
        {/* Sentiment Filter */}
        <select className="bg-terminal-black border border-terminal-medium-gray text-terminal-light-gray text-xs rounded-sm px-3 py-1.5 focus:border-brand-primary focus:outline-none cursor-pointer hover:border-terminal-light-gray transition-colors font-mono">
          <option>所有情绪</option>
          <option>看多</option>
          <option>看空</option>
          <option>中性</option>
        </select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-terminal-light-gray" />
        <input 
          type="text" 
          placeholder="搜索叙事..." 
          className="w-full lg:w-64 bg-terminal-black border border-terminal-medium-gray text-foreground text-xs rounded-sm pl-9 pr-3 py-1.5 focus:border-brand-primary focus:outline-none placeholder:text-terminal-medium-gray font-mono"
        />
      </div>
    </div>
  );
}
