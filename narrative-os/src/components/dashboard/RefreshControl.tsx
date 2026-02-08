'use client';
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function RefreshControl() {
    const handleRefresh = async () => {
        const promise = fetch('/api/system/refresh', { method: 'POST' });
        toast.promise(promise, {
            loading: 'Initiating global system refresh...',
            success: 'Ingestion & Analysis pipeline triggered',
            error: 'Failed to trigger refresh'
        });
    };

    return (
        <button 
            onClick={handleRefresh}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-text-muted hover:text-primary active:scale-95"
            title="Trigger System Refresh"
        >
            <RefreshCw className="w-4 h-4" />
        </button>
    );
}
