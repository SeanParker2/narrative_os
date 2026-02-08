import Link from 'next/link';
import { Terminal, Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center text-center font-mono">
      <div className="mb-6 rounded-full bg-terminal-medium-gray p-6">
        <Terminal className="h-12 w-12 text-brand-primary" />
      </div>
      
      <h1 className="mb-2 text-4xl font-bold tracking-tighter text-foreground">
        404 <span className="text-terminal-light-gray">|</span> 信号丢失
      </h1>
      
      <p className="mb-8 max-w-md text-terminal-light-gray">
        您正在寻找的叙事可能已经消退，或者从未存在过。
        请重新校准您的搜索参数。
      </p>

      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 rounded-sm bg-brand-primary px-4 py-2 text-sm font-bold text-terminal-black hover:bg-terminal-green transition-colors"
        >
          <Home className="h-4 w-4" />
          返回仪表盘
        </Link>
        
        <Link 
          href="/alerts"
          className="flex items-center gap-2 rounded-sm border border-terminal-medium-gray px-4 py-2 text-sm font-bold text-foreground hover:bg-terminal-medium-gray transition-colors"
        >
          <AlertTriangle className="h-4 w-4 text-terminal-amber" />
          检查告警
        </Link>
      </div>

      <div className="mt-12 text-[10px] text-terminal-medium-gray uppercase tracking-widest">
        Narrative OS v1.0 • 系统状态：正常
      </div>
    </div>
  );
}
