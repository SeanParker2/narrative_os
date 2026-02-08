'use client';

import React, { useState, useEffect } from 'react';
import { NarrativeMap } from '@/components/narratives/map/NarrativeMap';
import { NarrativeMapSidebar } from '@/components/narratives/map/NarrativeMapSidebar';
import { GraphData, GraphNode } from '@/types';

export default function NarrativeMapPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/narratives/map');
        const data = await res.json();
        setGraphData(data);
      } catch (error) {
        console.error('获取图谱数据失败', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-terminal-light-gray font-mono">
        正在加载图谱数据...
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-6rem)] border border-terminal-medium-gray bg-terminal-black overflow-hidden flex flex-col">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-xl font-bold text-terminal-green font-mono uppercase tracking-wider bg-terminal-black/80 px-2 py-1 inline-block border border-terminal-green/30 backdrop-blur-sm">
          叙事图谱
        </h1>
        <div className="text-[10px] text-terminal-light-gray font-mono mt-1 bg-terminal-black/80 px-2 py-1 inline-block border border-terminal-medium-gray backdrop-blur-sm">
          力导向布局 • 实时交互 • {graphData?.nodes.length} 个节点
        </div>
      </div>

      {graphData && (
        <NarrativeMap 
          data={graphData} 
          onNodeClick={setSelectedNode} 
        />
      )}
      
      <NarrativeMapSidebar 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
}
