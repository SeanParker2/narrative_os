'use client';

import React from 'react';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GraphNode } from '@/types';

interface Props {
  selectedNode: GraphNode | null;
  onClose: () => void;
}

const lifecycleLabelMap: Record<string, string> = {
  Emerging: '萌芽',
  Hyped: '热潮',
  Consensus: '共识',
  Fading: '衰退'
};

const getLifecycleLabel = (value?: string) => lifecycleLabelMap[value ?? ''] ?? value ?? '';

export function NarrativeMapSidebar({ selectedNode, onClose }: Props) {
  return (
    <div className="absolute right-0 top-0 h-full w-80 border-l border-terminal-medium-gray bg-terminal-dark-gray/95 backdrop-blur-sm transition-transform duration-300 transform translate-x-0 z-10 flex flex-col shadow-2xl">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-terminal-medium-gray flex justify-between items-center bg-terminal-black/50">
        <h3 className="font-bold uppercase tracking-wider text-terminal-light-gray font-mono text-xs">节点详情</h3>
        {selectedNode && (
          <button onClick={onClose} className="text-terminal-light-gray hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedNode ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground font-mono mb-2">{selectedNode.name.split(' (')[0]}</h2>
              <div className="flex gap-2">
                <Badge type={selectedNode.category} className="px-2">{getLifecycleLabel(selectedNode.category)}</Badge>
                <Badge type="default" className="font-bold">强度：{selectedNode.value}</Badge>
              </div>
            </div>

            <div className="space-y-2 border-t border-terminal-medium-gray pt-4">
              <div className="text-xs text-terminal-light-gray font-mono uppercase font-bold">快速摘要</div>
              <p className="text-xs text-foreground leading-relaxed font-sans text-justify">
                该叙事目前处于 {getLifecycleLabel(selectedNode.category)} 阶段，显示出强劲的上升动能。
                关键节点聚类表明其与核心科技板块具有高度关联性。
              </p>
            </div>

            <Link 
              href={`/narratives/detail/${selectedNode.id}`}
              className="inline-flex items-center gap-2 text-xs text-terminal-green hover:underline font-mono uppercase tracking-wide"
            >
              查看完整分析 <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-terminal-light-gray text-xs font-mono">
            <p>点击节点查看详情</p>
          </div>
        )}
      </div>

      {/* Controls (Bottom) */}
      <div className="p-4 border-t border-terminal-medium-gray space-y-3 bg-terminal-black/80">
        <div className="text-[10px] text-terminal-light-gray uppercase font-bold font-mono mb-2">地图控制</div>
        <div className="space-y-2">
           <label className="flex items-center justify-between text-xs text-foreground font-mono">
             <span>市场筛选</span>
             <select className="bg-terminal-dark-gray border border-terminal-medium-gray rounded-sm text-[10px] px-2 py-1 focus:border-terminal-blue outline-none cursor-pointer">
               <option>所有市场</option>
               <option>加密货币</option>
               <option>科技股</option>
             </select>
           </label>
           <label className="flex items-center justify-between text-xs text-foreground font-mono">
             <span>着色模式</span>
             <select className="bg-terminal-dark-gray border border-terminal-medium-gray rounded-sm text-[10px] px-2 py-1 focus:border-terminal-blue outline-none cursor-pointer">
               <option>生命周期</option>
               <option>情绪倾向</option>
             </select>
           </label>
        </div>
      </div>
    </div>
  );
}
