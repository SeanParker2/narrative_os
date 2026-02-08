'use client';
import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, Loader2, Zap, Hash, Box } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReportModal } from './dashboard/ReportModal';
import { EntityInspector } from './dashboard/EntityInspector';

export const CommandNexus = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{narratives: any[], entities: any[]}>({ narratives: [], entities: [] });
  
  // State for opening modals from command
  const [selectedNarrative, setSelectedNarrative] = useState<{id: string, name: string} | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  // Toggle with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search logic (Client-side filtering for MVP, Server-side for Prod)
  useEffect(() => {
    if (!query) return;
    
    // In a real app, this would be a debounced API call: /api/search?q=...
    // For this demo, we'll fetch the full list once and filter locally or just simulate
    // Let's assume we fetch all narratives for search context
    const search = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const res = await fetch(`${baseUrl}/api/narratives`);
            const narratives = await res.json();
            
            // Filter Narratives
            const matchedNarratives = narratives.filter((n: any) => 
                n.name.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3);

            // Mock Entities (since we don't have an entity list API yet)
            // In prod, this would hit an entity search endpoint
            const commonEntities = ["Nvidia", "Bitcoin", "Sam Altman", "SEC", "OpenAI", "Tesla", "China"];
            const matchedEntities = commonEntities.filter(e => 
                e.toLowerCase().includes(query.toLowerCase())
            ).map(e => ({ name: e }));

            setResults({ narratives: matchedNarratives, entities: matchedEntities });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Command Palette Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-fade-in">
            <div className="w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden font-sans">
                <Command className="w-full">
                    <div className="flex items-center border-b border-white/10 px-4 py-3">
                        <Search className="w-5 h-5 text-text-muted mr-3" />
                        <Command.Input 
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Search narratives, entities, or commands..."
                            className="flex-1 bg-transparent outline-none text-white placeholder:text-text-muted/50 text-sm"
                            autoFocus
                        />
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                        <div className="ml-3 flex gap-1">
                            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-text-muted">ESC</span>
                        </div>
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2">
                        <Command.Empty className="p-4 text-center text-text-muted text-sm">No results found.</Command.Empty>

                        {/* System Commands */}
                        <Command.Group heading="System" className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2 px-2">
                            <Command.Item 
                                onSelect={() => {
                                    // Trigger refresh
                                    fetch('/api/system/refresh', { method: 'POST' });
                                    setOpen(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors mb-1 group"
                            >
                                <Zap className="w-4 h-4 text-text-muted group-hover:text-primary" />
                                <span>Trigger System Refresh</span>
                            </Command.Item>
                        </Command.Group>

                        {/* Narratives */}
                        {results.narratives.length > 0 && (
                            <Command.Group heading="Narratives" className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2 px-2 mt-4">
                                {results.narratives.map(n => (
                                    <Command.Item 
                                        key={n.id}
                                        onSelect={() => {
                                            setSelectedNarrative({ id: n.id, name: n.name });
                                            setOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors mb-1 group"
                                    >
                                        <Hash className="w-4 h-4 text-text-muted group-hover:text-primary" />
                                        <span>{n.name}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {/* Entities */}
                        {results.entities.length > 0 && (
                            <Command.Group heading="Entities" className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2 px-2 mt-4">
                                {results.entities.map(e => (
                                    <Command.Item 
                                        key={e.name}
                                        onSelect={() => {
                                            setSelectedEntity(e.name);
                                            setOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors mb-1 group"
                                    >
                                        <Box className="w-4 h-4 text-text-muted group-hover:text-secondary" />
                                        <span>{e.name}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                    </Command.List>
                </Command>
            </div>
        </div>
      )}

      {/* Global Modals triggered from Command Palette */}
      {selectedNarrative && (
        <ReportModal 
            narrativeId={selectedNarrative.id} 
            narrativeName={selectedNarrative.name} 
            onClose={() => setSelectedNarrative(null)} 
        />
      )}

      {selectedEntity && (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Render Inspector in a fixed position overlay */}
            <div className="pointer-events-auto h-full w-full relative">
                <EntityInspector 
                    entityName={selectedEntity} 
                    onClose={() => setSelectedEntity(null)} 
                />
            </div>
        </div>
      )}
    </>
  );
};
