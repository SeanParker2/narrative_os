'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Swords, User, Bot, Gavel } from 'lucide-react';

interface WargameViewProps {
  narrativeId: string;
}

export const WargameView: React.FC<WargameViewProps> = ({ narrativeId }) => {
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSimulation = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/narratives/${narrativeId}/wargame`);
        const data = await res.json();
        setSimulation(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSimulation();
  }, [narrativeId]);

  // Auto-scroll
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [simulation]);

  if (loading) {
      return (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-accent">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="text-xs uppercase tracking-widest animate-pulse">
                  Initializing War Room Simulation...
              </div>
          </div>
      );
  }

  if (!simulation || !simulation.turns) return <div className="p-4 text-center text-text-muted">Simulation Failed</div>;

  return (
    <div className="flex flex-col h-full gap-4 p-2 overflow-y-auto custom-scrollbar" ref={scrollRef}>
        
        {/* Intro */}
        <div className="text-center py-4 border-b border-white/10 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                <Swords className="w-3 h-3" /> Dialectic Wargame
            </div>
            <div className="mt-2 text-[10px] text-text-muted">
                Simulating debate between <span className="text-success font-bold">Dr. Bull</span> and <span className="text-accent font-bold">Mr. Bear</span>
            </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 space-y-6">
            {simulation.turns.map((turn: any, i: number) => {
                const isBull = turn.speaker === 'Dr. Bull';
                return (
                    <div key={i} className={`flex gap-4 ${isBull ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                            isBull ? 'bg-success/10 border-success/30 text-success' : 'bg-accent/10 border-accent/30 text-accent'
                        }`}>
                            {isBull ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`flex-1 p-3 rounded-lg border text-sm leading-relaxed ${
                            isBull ? 'bg-success/5 border-success/10 text-white/90 rounded-tl-none' : 'bg-accent/5 border-accent/10 text-white/90 rounded-tr-none'
                        }`}>
                            <div className={`text-[10px] font-bold uppercase mb-1 ${isBull ? 'text-success' : 'text-accent'}`}>
                                {turn.speaker}
                            </div>
                            {turn.content}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Verdict */}
        {simulation.verdict && (
            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Gavel className="w-4 h-4" /> Final Verdict
                </div>
                <div className="text-sm text-white font-mono leading-relaxed">
                    {simulation.verdict}
                </div>
            </div>
        )}
    </div>
  );
};
