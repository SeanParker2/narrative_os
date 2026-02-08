'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Share2 } from 'lucide-react';
import { GraphData } from '@/types';
import { Panel } from '@/components/ui/Panel';

export function RelatedGraph({ data }: { data: GraphData }) {
  const option = {
    backgroundColor: 'transparent',
    series: [{
      type: 'graph',
      layout: 'force',
      data: data.nodes.map(n => ({
        ...n,
        symbolSize: n.value / 3,
        itemStyle: {
          color: n.category === 'Emerging' ? '#2979ff' :
                 n.category === 'Hyped' ? '#ffab00' :
                 n.category === 'Consensus' ? '#00e676' : '#666'
        },
        label: { show: true, position: 'right', color: '#888', fontSize: 10 }
      })),
      links: data.links,
      roam: true,
      force: { repulsion: 120, gravity: 0.1, edgeLength: 60 },
      lineStyle: { color: '#333', curveness: 0.2, width: 1 }
    }]
  };

  return (
    <Panel 
      title="关联叙事" 
      icon={Share2}
      className="h-full"
    >
      <div className="h-full min-h-[200px]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Panel>
  );
}
