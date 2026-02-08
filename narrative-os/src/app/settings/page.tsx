import React from 'react';
import { Settings, Bell, Shield, Database, Monitor } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-terminal-medium-gray pb-3">
        <div className="bg-terminal-medium-gray p-2 rounded-full">
          <Settings className="h-6 w-6 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground font-mono uppercase tracking-wider">
            系统配置
          </h1>
           <p className="text-xs text-terminal-light-gray font-mono">
             管理数据源、告警阈值及显示偏好设置。
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Panel title="显示与界面" icon={Monitor}>
           <div className="p-4 space-y-4">
             <div className="flex items-center justify-between">
               <span className="text-sm text-foreground">主题模式</span>
               <select className="bg-terminal-black border border-terminal-medium-gray text-xs px-2 py-1 rounded-sm cursor-pointer">
                <option>彭博深色（默认）</option>
                 <option>高对比度模式</option>
               </select>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-sm text-foreground">数据刷新率</span>
               <select className="bg-terminal-black border border-terminal-medium-gray text-xs px-2 py-1 rounded-sm cursor-pointer">
                <option>实时连接</option>
                 <option>10 秒</option>
                 <option>1 分钟</option>
               </select>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-sm text-foreground">信息密度</span>
               <div className="flex gap-2">
                 <button className="px-3 py-1 bg-brand-primary text-terminal-black text-xs font-bold rounded-sm">高</button>
                 <button className="px-3 py-1 bg-terminal-medium-gray text-terminal-light-gray text-xs rounded-sm hover:bg-terminal-light-gray hover:text-terminal-black transition-colors">低</button>
               </div>
             </div>
           </div>
        </Panel>

        {/* Alert Thresholds */}
        <Panel title="告警阈值设置" icon={Bell}>
           <div className="p-4 space-y-4">
             <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span className="text-terminal-light-gray">市场冲击灵敏度</span>
                 <span className="text-brand-primary font-mono">高 (80%)</span>
               </div>
               <div className="h-1 bg-terminal-medium-gray rounded-full overflow-hidden">
                 <div className="h-full bg-brand-primary w-[80%]"></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span className="text-terminal-light-gray">情绪分歧触发线</span>
                 <span className="text-terminal-purple font-mono">中 (50%)</span>
               </div>
               <div className="h-1 bg-terminal-medium-gray rounded-full overflow-hidden">
                 <div className="h-full bg-terminal-purple w-[50%]"></div>
               </div>
             </div>
           </div>
        </Panel>

        {/* Data Sources */}
        <Panel title="数据源连接状态" icon={Database}>
           <div className="p-4 space-y-3">
              {[
                { name: '彭博终端 API', status: '已连接', color: 'text-brand-primary' },
                { name: 'X 全量数据流', status: '已连接', color: 'text-brand-primary' },
                { name: '红迪接口', status: '延迟较高', color: 'text-terminal-amber' },
                { name: '链上指标', status: '断开连接', color: 'text-terminal-red' },
              ].map((feed, i) => (
               <div key={i} className="flex items-center justify-between text-sm border-b border-terminal-medium-gray pb-2 last:border-0 last:pb-0">
                 <span>{feed.name}</span>
                 <span className={`text-xs font-mono font-bold ${feed.color}`}>{feed.status}</span>
               </div>
             ))}
           </div>
        </Panel>

        {/* Security */}
        <Panel title="安全与 API 密钥" icon={Shield}>
           <div className="p-4 space-y-4">
             <div className="bg-terminal-black/50 p-3 rounded-sm border border-terminal-medium-gray">
              <div className="text-[10px] text-terminal-light-gray uppercase mb-1">活跃 API 密钥</div>
               <div className="font-mono text-xs text-foreground flex justify-between">
                 <span>pk_live_****************4x92</span>
                 <button className="text-brand-primary hover:underline">轮换密钥</button>
               </div>
             </div>
             <button className="w-full py-2 bg-terminal-medium-gray hover:bg-terminal-light-gray text-foreground text-xs font-bold rounded-sm transition-colors">
              管理访问控制列表
             </button>
           </div>
        </Panel>
      </div>
    </div>
  );
}
