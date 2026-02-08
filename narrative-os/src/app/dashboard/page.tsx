'use client';
import React from 'react';
import { GlassCard, Badge } from '@/components/ui/Glass';
import { DailyBriefing } from '@/components/dashboard/DailyBriefing';
import { KnowledgeGraph } from '@/components/dashboard/KnowledgeGraph';
import { Activity, Globe, Zap, Cpu, RefreshCw } from 'lucide-react';
import { TopNarratives } from '@/components/dashboard/TopNarratives';
import { EmergingNarratives } from '@/components/dashboard/EmergingNarratives';
import { toast } from 'sonner';
import { RefreshControl } from '@/components/dashboard/RefreshControl';

// Server Components data fetching
async function getDashboardData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  const [narrativesRes, alertsRes, briefingRes] = await Promise.allSettled([
    fetch(`${baseUrl}/api/narratives`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/alerts/shock`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/briefing`, { cache: 'no-store' })
  ]);

  const narratives = narrativesRes.status === 'fulfilled' && narrativesRes.value.ok ? await narrativesRes.value.json() : [];
  const alerts = alertsRes.status === 'fulfilled' && alertsRes.value.ok ? await alertsRes.value.json() : [];
  
  let briefing = { content: "System initializing...", timestamp: new Date().toISOString() };
  if (briefingRes.status === 'fulfilled' && briefingRes.value.ok) {
      briefing = await briefingRes.value.json();
  }

  return { narratives, alerts, briefing };
}

export default async function DashboardPage() {
  const { narratives, alerts, briefing } = await getDashboardData();

  return (
    <div className="h-screen w-full bg-[var(--bg-deep)] overflow-hidden flex flex-col p-4 gap-4 font-sans text-text-main selection:bg-primary/30">
      
      {/* Header / HUD */}
      <header className="flex justify-between items-center px-2 py-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse-glow">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              NARRATIVE OS <Badge variant="accent" className="text-[10px] py-0">BETA</Badge>
            </h1>
            <div className="text-[10px] text-text-muted font-mono-tech tracking-wider uppercase">
              Global Sentiment Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Manual Refresh Control */}
           <RefreshControl />

           <div className="hidden md:flex items-center gap-6 px-4 py-2 rounded-full border border-[var(--border-glass)] bg-[var(--bg-card)] backdrop-blur-md">
              <div className="flex flex-col items-center">
                  <span className="text-[10px] text-text-muted uppercase">System</span>
                  <span className="text-xs font-bold text-success">ONLINE</span>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex flex-col items-center">
                  <span className="text-[10px] text-text-muted uppercase">Latency</span>
                  <span className="text-xs font-bold text-primary">24ms</span>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex flex-col items-center">
                  <span className="text-[10px] text-text-muted uppercase">Active Nodes</span>
                  <span className="text-xs font-bold text-secondary">842</span>
              </div>
           </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <main className="flex-1 grid grid-cols-12 grid-rows-12 gap-4 min-h-0">
        
        {/* LEFT COLUMN (3/12) */}
        <div className="col-span-12 lg:col-span-3 row-span-12 flex flex-col gap-4">
          {/* Briefing Card */}
          <GlassCard className="flex-[2] flex flex-col relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
             <DailyBriefing content={briefing.content} timestamp={briefing.timestamp} />
          </GlassCard>

          {/* Alerts / Ticker */}
          <GlassCard className="flex-1 flex flex-col">
             <div className="flex items-center gap-2 mb-3 text-accent font-bold text-xs uppercase tracking-widest">
                <Zap className="w-4 h-4" /> Live Shocks
             </div>
             <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {alerts.length === 0 ? (
                    <div className="text-text-muted text-xs italic text-center mt-10">No active anomalies detected.</div>
                ) : (
                    alerts.map((alert: any) => (
                        <div key={alert.id} className="p-2 rounded bg-accent/5 border border-accent/10 text-xs hover:bg-accent/10 transition-colors cursor-pointer">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-accent">{alert.narrative_name}</span>
                                <span className="text-[10px] text-text-muted">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="text-white/80 leading-tight">{alert.message}</div>
                        </div>
                    ))
                )}
             </div>
          </GlassCard>
        </div>

        {/* CENTER COLUMN (6/12) - THE MAP */}
        <div className="col-span-12 lg:col-span-6 row-span-12 relative">
           <GlassCard className="w-full h-full p-0 overflow-hidden relative border-primary/20">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
                 <div className="text-xs font-bold text-primary flex items-center gap-2">
                    <Globe className="w-3 h-3" /> NEXUS GRAPH
                 </div>
                 <div className="text-[10px] text-text-muted">Real-time entity relationship matrix</div>
              </div>
              <KnowledgeGraph />
              
              {/* Overlay Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(3,7,18,0.4)_100%)]"></div>
           </GlassCard>
        </div>

        {/* RIGHT COLUMN (3/12) */}
        <div className="col-span-12 lg:col-span-3 row-span-12 flex flex-col gap-4">
           {/* Top Narratives */}
           <GlassCard className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3 text-primary font-bold text-xs uppercase tracking-widest">
                  <Activity className="w-4 h-4" /> Top Narratives
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                  <TopNarratives data={narratives} />
              </div>
           </GlassCard>

           {/* Emerging */}
           <GlassCard className="flex-1 flex flex-col bg-secondary/5 border-secondary/10">
              <div className="flex items-center gap-2 mb-3 text-secondary font-bold text-xs uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  Emerging Signals
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                  <EmergingNarratives data={narratives} />
              </div>
           </GlassCard>
        </div>

      </main>
    </div>
  );
}
