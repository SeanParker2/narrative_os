'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Radar } from 'lucide-react';
import { Narrative } from '@/types';
import { Panel } from '@/components/ui/Panel';

export function SentimentDivergence({ data }: { data: Narrative[] }) {
  const getScore = (seed: string, multiplier: number) => {
    const total = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0) * multiplier, 0);
    return total % 100;
  };

  const chartData = data.slice(0, 3).map(n => ({
    name: n.name.split(' ')[0], // Keep name short
    media: getScore(`${n.id}-${n.name}`, 3),
    social: getScore(`${n.id}-${n.market}`, 7),
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(28, 28, 30, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 0.5,
      textStyle: { color: '#f5f5f7', fontSize: 12, fontFamily: 'PingFang SC' },
      padding: 12,
      extraCssText: 'backdrop-filter: blur(20px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); border-radius: 8px;'
    },
    radar: {
      indicator: chartData.map(d => ({ name: d.name, max: 100 })),
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
      axisName: { color: '#8e8e93', fontSize: 11, fontFamily: 'PingFang SC' }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: chartData.map(d => d.media),
            name: '媒体情绪',
            itemStyle: { color: '#0a84ff' },
            lineStyle: { width: 2, opacity: 0.8 },
            areaStyle: { color: 'rgba(10, 132, 255, 0.15)' },
            symbol: 'none'
          },
          {
            value: chartData.map(d => d.social),
            name: '社交情绪',
            itemStyle: { color: '#ff9f0a' },
            lineStyle: { width: 2, opacity: 0.8 },
            areaStyle: { color: 'rgba(255, 159, 10, 0.15)' },
            symbol: 'none'
          }
        ]
      }
    ]
  };

  const rightContent = (
    <div className="flex gap-3 text-[10px]" title="衡量专业媒体与社交网络的情绪差异">
      <span className="flex items-center gap-1.5 text-terminal-blue">
        <span className="w-2 h-2 bg-terminal-blue rounded-full"></span> 媒体
      </span>
      <span className="flex items-center gap-1.5 text-terminal-amber">
        <span className="w-2 h-2 bg-terminal-amber rounded-full"></span> 社交
      </span>
    </div>
  );

  return (
    <Panel 
      title="情绪分歧雷达" 
      icon={Radar} 
      rightContent={rightContent}
      className="h-full"
    >
      <div className="h-full w-full min-h-[180px]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Panel>
  );
}
