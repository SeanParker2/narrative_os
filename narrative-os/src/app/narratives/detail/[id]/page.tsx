import React from 'react';
import { notFound } from 'next/navigation';
import { NarrativeHeader } from '@/components/narratives/detail/NarrativeHeader';
import { NarrativeSummary } from '@/components/narratives/detail/NarrativeSummary';
import { StrengthRadar } from '@/components/narratives/detail/StrengthRadar';
import { NarrativeTimeline } from '@/components/narratives/detail/NarrativeTimeline';
import { EvidenceFeed } from '@/components/narratives/detail/EvidenceFeed';
import { RelatedGraph } from '@/components/narratives/detail/RelatedGraph';
import { CompetingNarratives } from '@/components/narratives/detail/CompetingNarratives';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getNarrativeDetail(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/narratives/${id}`, { cache: 'no-store' });
  
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('获取叙事详情失败');
  
  return res.json();
}

export default async function NarrativeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const narrative = await getNarrativeDetail(id);

  if (!narrative) {
    return notFound();
  }

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header Area */}
      <NarrativeHeader narrative={narrative} />

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left Column: Summary & Timeline (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
           {/* Summary moved to top as requested */}
           <div className="shrink-0">
             <NarrativeSummary narrative={narrative} />
           </div>
           <div className="flex-1 min-h-[300px]">
             <NarrativeTimeline data={narrative.timeline} />
           </div>
        </div>

        {/* Middle Column: Radar & Evidence (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
           <div className="h-1/3 min-h-[250px]">
             <StrengthRadar data={narrative.radar_data} />
           </div>
           <div className="flex-1 min-h-[300px]">
             <EvidenceFeed data={narrative.evidence} />
           </div>
        </div>

        {/* Right Column: Relations & Competitors (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-full">
           <div className="h-1/2 min-h-[200px]">
              <RelatedGraph data={narrative.relations} />
           </div>
           <div className="h-1/2 min-h-[200px]">
              <CompetingNarratives data={narrative.competitors} />
           </div>
        </div>
      </div>
    </div>
  );
}
