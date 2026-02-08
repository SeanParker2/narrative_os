'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GlassCard, Badge } from '@/components/ui/Glass';
import { X, Loader2, Sparkles, FileText, Swords } from 'lucide-react';
import { WargameView } from './WargameView';

interface ReportModalProps {
  narrativeId: string | null;
  narrativeName: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ narrativeId, narrativeName, onClose }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [activeTab, setActiveTab] = useState<'report' | 'wargame'>('report');
  const [researchTriggered, setResearchTriggered] = useState(false);

  // Auto-Trigger Research if report is missing or old
  useEffect(() => {
    if (!narrativeId || activeTab !== 'report' || researchTriggered) return;

    // We can optimistically trigger a background research job here
    // In a real app, we'd check if report is empty first.
    // For now, let's add a manual "Deep Research" button instead of auto-triggering on every open
  }, [narrativeId]);

  // Fetch Report
  useEffect(() => {
    if (!narrativeId || activeTab !== 'report') return;
    
    const fetchReport = async () => {
      // Only fetch if not already loaded (simple local cache)
      if (report) return; 
      
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/narratives/${narrativeId}/report`);
        const data = await res.json();
        setReport(data.content);
      } catch (e) {
        console.error("Failed to fetch report", e);
        setReport("Error generating report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [narrativeId, activeTab]);

  const handleDeepResearch = async () => {
      setLoading(true);
      setReport("Initiating Deep Research Agent...\n\n> Connecting to DeepSeek V3...\n> Analyzing Context...\n> Identifying Conflicts...\n\n(This may take 30-60 seconds)");
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        // Trigger
        await fetch(`${baseUrl}/api/research/trigger`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ clusterId: narrativeId })
        });

        // Poll for result (Mocking polling by just waiting and retrying fetch)
        // In prod: Use WebSockets or proper polling
        setTimeout(async () => {
             const res = await fetch(`${baseUrl}/api/narratives/${narrativeId}/report`);
             const data = await res.json();
             setReport(data.content);
             setLoading(false);
        }, 15000); // Wait 15s for first check

      } catch (e) {
          setReport("Research Failed.");
          setLoading(false);
      }
  };


  // Typewriter Effect
  useEffect(() => {
    if (!report || activeTab !== 'report') return;
    
    // If already fully displayed, skip effect
    if (displayedContent === report) return;

    let i = 0;
    const speed = 2; // faster
    const interval = setInterval(() => {
      setDisplayedContent(report.substring(0, i));
      i += 5; // Chunk for speed
      if (i > report.length) {
          setDisplayedContent(report);
          clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [report, activeTab]);

  if (!narrativeId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <GlassCard className="w-full max-w-4xl h-[85vh] flex flex-col relative border-primary/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide">INTELLIGENCE</h2>
                        <div className="text-sm text-primary font-mono max-w-[200px] truncate">{narrativeName}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                    <button 
                        onClick={() => setActiveTab('report')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                            activeTab === 'report' ? 'bg-primary text-black shadow-lg' : 'text-text-muted hover:text-white'
                        }`}
                    >
                        <FileText className="w-3 h-3" /> Report
                    </button>
                    <button 
                        onClick={() => setActiveTab('wargame')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                            activeTab === 'wargame' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-white'
                        }`}
                    >
                        <Swords className="w-3 h-3" /> Wargame
                    </button>
                    <button 
                        onClick={handleDeepResearch}
                        className="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 ml-2"
                        title="Start Multi-turn Deep Research"
                    >
                        <Sparkles className="w-3 h-3" /> Deep Research
                    </button>
                </div>
            </div>

            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-text-muted" />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
            {activeTab === 'report' ? (
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar font-mono text-sm leading-relaxed">
                    {loading && !report ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-primary">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <div className="text-xs uppercase tracking-widest animate-pulse">
                                Analyzing Cluster Data...
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none text-text-main/90">
                            <ReactMarkdown 
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2 mt-6" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-lg font-bold text-secondary mt-6 mb-3 flex items-center gap-2" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-md font-bold text-primary mt-4 mb-2" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                                    li: ({node, ...props}) => <li className="marker:text-primary/50" {...props} />
                                }}
                            >
                                {displayedContent}
                            </ReactMarkdown>
                            {/* Cursor */}
                            {displayedContent.length < (report?.length || 0) && (
                                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle"></span>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <WargameView narrativeId={narrativeId} />
            )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 mt-4 shrink-0 flex justify-between items-center text-[10px] text-text-muted uppercase tracking-widest">
            <div className="flex gap-4">
                <span>Status: <span className="text-success">Active</span></span>
                <span>Model: DeepSeek-V3</span>
            </div>
            <div className="flex items-center gap-2">
                <FileText className="w-3 h-3" /> {activeTab === 'report' ? 'Strategic Analysis' : 'Dialectic Simulation'}
            </div>
        </div>

      </GlassCard>
    </div>
  );
};
