'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity } from 'lucide-react';
import { TimelineEvent } from '@/types';
import { Panel } from '@/components/ui/Panel';

export function NarrativeTimeline({ data }: { data: TimelineEvent[] }) {
  const option = {
    backgroundColor: 'transparent',
    grid: { top: 40, right: 20, bottom: 20, left: 40 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: 'rgba(255,255,255,0.2)', width: 1 } },
      backgroundColor: 'rgba(28, 28, 30, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 0.5,
      textStyle: { color: '#f5f5f7', fontSize: 12, fontFamily: 'PingFang SC' },
      padding: 12,
      extraCssText: 'backdrop-filter: blur(20px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); border-radius: 8px;'
    },
    legend: {
      data: ['强度', '情绪'],
      textStyle: { color: '#8e8e93', fontSize: 11 },
      top: 5,
      right: 10,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle'
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { color: '#8e8e93', fontSize: 11, fontFamily: '-apple-system' },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '强度',
        nameTextStyle: { color: '#8e8e93', fontSize: 10, padding: [0, 0, 0, 10] },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
        axisLabel: { color: '#8e8e93', fontSize: 10 }
      },
      {
        type: 'value',
        name: '情绪',
        nameTextStyle: { color: '#8e8e93', fontSize: 10 },
        min: -1,
        max: 1,
        splitLine: { show: false },
        axisLabel: { show: false }
      }
    ],
    series: [
      {
        name: '强度',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: data.map(d => d.value),
        itemStyle: { color: '#32d74b' },
        lineStyle: { width: 2, shadowBlur: 0 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(50, 215, 75, 0.2)' }, { offset: 1, color: 'rgba(50, 215, 75, 0)' }]
          }
        },
        markPoint: {
          data: data.filter(d => d.event).map(d => ({
            name: '事件',
            coord: [d.date, d.value],
            value: d.event,
            itemStyle: { color: '#0a84ff' },
            label: { color: '#fff', fontSize: 10 }
          })),
          symbolSize: 30
        }
      },
      {
        name: '情绪',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: 6,
        itemStyle: { borderRadius: [2, 2, 0, 0] },
        data: data.map(d => ({
            value: d.sentiment,
            itemStyle: {
                color: d.sentiment > 0 ? '#32d74b' : '#ff453a',
                opacity: 0.5
            }
        }))
      }
    ]
  };

  return (
    <Panel 
      title="趋势时间线" 
      icon={Activity}
      className="shadow-sm"
    >
      <div className="h-[300px] w-full">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Panel>
  );
}
