'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Radar } from 'lucide-react';
import { NarrativeDetail } from '@/types';
import { Panel } from '@/components/ui/Panel';

export function StrengthRadar({ data }: { data: NarrativeDetail['radar_data'] }) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: '#333',
      textStyle: { color: '#e0e0e0', fontSize: 12, fontFamily: 'PingFang SC' },
      formatter: (params: { name: string; value: number[] }) => {
        return `
          <div class="font-bold mb-1">${params.name}</div>
          ${params.value.map((val: number, i: number) => {
            const indicators = ['社交热度', '传播速度', '媒体覆盖', '互动深度', '来源权威', '持续时间'];
            const descriptions = [
              '总提及量与讨论热度',
              '信息扩散的加速度',
              '主流媒体报道范围',
              '用户参与互动的比率',
              '信息源的可信度评分',
              '话题维持活跃的时长'
            ];
            return `<div class="flex justify-between gap-4 text-[10px]">
              <span class="text-terminal-light-gray">${indicators[i]}:</span>
              <span class="font-mono text-brand-primary">${val}</span>
            </div>
            <div class="text-[9px] text-terminal-light-gray/50 mb-1">${descriptions[i]}</div>`;
          }).join('')}
        `;
      }
    },
    radar: {
      indicator: [
        { name: '社交热度', max: 100 },
        { name: '传播速度', max: 100 },
        { name: '媒体覆盖', max: 100 },
        { name: '互动深度', max: 100 },
        { name: '来源权威', max: 100 },
        { name: '持续时间', max: 100 },
      ],
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: '#2a2a2a' } },
      splitLine: { lineStyle: { color: '#2a2a2a' } },
      axisName: { color: '#888', fontSize: 11, fontFamily: 'PingFang SC', fontWeight: 'bold' },
      radius: '65%'
    },
    series: [{
      type: 'radar',
      data: [{
        value: [data.volume, data.velocity, data.reach, data.engagement, data.credibility, data.persistence],
        name: '强度六维分析',
        itemStyle: { color: '#00e676' },
        areaStyle: { color: 'rgba(0, 230, 118, 0.2)' },
        lineStyle: { width: 2, shadowBlur: 10, shadowColor: 'rgba(0, 230, 118, 0.5)' },
        symbol: 'circle',
        symbolSize: 4
      }]
    }]
  };

  return (
    <Panel 
      title="强度六维分析" 
      icon={Radar}
      className="h-full shadow-lg"
    >
      <div className="h-full min-h-[200px] relative group">
        <div className="absolute top-2 right-2 text-[10px] text-terminal-light-gray opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-sans">
          悬停查看指标详情
        </div>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Panel>
  );
}
