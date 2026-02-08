'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { GraphData } from '@/types';

interface Props {
  data: GraphData;
  onNodeClick: (node: GraphData['nodes'][number]) => void;
}

export function NarrativeMap({ data, onNodeClick }: Props) {
  const option = {
    backgroundColor: '#0a0a0a',
    tooltip: { show: false }, // 由侧边栏展示
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: data.nodes.map(n => ({
          ...n,
          symbolSize: n.value / 2,
          itemStyle: {
            color: n.category === 'Emerging' ? '#2979ff' :
                   n.category === 'Hyped' ? '#ffab00' :
                   n.category === 'Consensus' ? '#00e676' : '#888',
            borderColor: n.value > 80 ? '#e0e0e0' : 'transparent',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            position: 'right',
            color: '#e0e0e0',
            fontSize: 12,
            fontFamily: 'PingFang SC',
            formatter: '{b}'
          }
        })),
        links: data.links,
        roam: true,
        force: {
          repulsion: 400,
          gravity: 0.1,
          edgeLength: 120
        },
        lineStyle: {
          color: '#2a2a2a',
          curveness: 0.2,
          width: 1.5
        }
      }
    ]
  };

  const onEvents: Record<string, (params: { dataType?: string; data?: GraphData['nodes'][number] }) => void> = {
    click: (params) => {
      if (params.dataType === 'node') {
        const node = params.data;
        if (node) {
          onNodeClick(node);
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%' }} 
        onEvents={onEvents}
      />
    </div>
  );
}
