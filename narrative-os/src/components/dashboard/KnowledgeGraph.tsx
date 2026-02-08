'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { EntityInspector } from './EntityInspector';

// Dynamic import to avoid SSR issues with canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export const KnowledgeGraph = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 400, h: 300 });
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

    useEffect(() => {
        const fetchGraph = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            try {
                const res = await fetch(`${baseUrl}/api/narratives/map`);
                if (res.ok) {
                    const data = await res.json();
                    setGraphData(data);
                }
            } catch (e) {
                console.error("Graph fetch failed", e);
            }
        };
        fetchGraph();

        // Resize observer
        if (containerRef.current) {
            setDimensions({
                w: containerRef.current.clientWidth,
                h: containerRef.current.clientHeight
            });
        }
        
        // Simple resize listener
        const handleResize = () => {
             if (containerRef.current) {
                setDimensions({
                    w: containerRef.current.clientWidth,
                    h: containerRef.current.clientHeight
                });
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden">
            {graphData.nodes.length > 0 ? (
                 <ForceGraph2D
                    width={dimensions.w}
                    height={dimensions.h}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeColor={node => (node as any).color}
                    nodeRelSize={4}
                    linkColor={() => 'rgba(255,255,255,0.1)'}
                    backgroundColor="transparent"
                    onNodeClick={node => {
                        // Only open inspector for Entity nodes (Group 2)
                        if ((node as any).group === 2) {
                            setSelectedEntity((node as any).name);
                        }
                    }}
                    enableNodeDrag={false} // Keep it stable for professional look
                    cooldownTicks={100}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-text-muted text-xs animate-pulse">
                    LOADING NEURAL NETWORK...
                </div>
            )}

            {/* Entity Inspector Drawer */}
            {selectedEntity && (
                <EntityInspector 
                    entityName={selectedEntity} 
                    onClose={() => setSelectedEntity(null)} 
                />
            )}
        </div>
    );
};
