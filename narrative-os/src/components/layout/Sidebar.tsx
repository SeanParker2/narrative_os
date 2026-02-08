'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  Lightbulb, 
  Database, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const menuItems: MenuItem[] = [
  { label: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
  { 
    label: '叙事', 
    href: '/narratives', 
    icon: BookOpen,
    children: [
      { label: '全部叙事', href: '/narratives' },
      { label: '叙事图谱', href: '/narratives/map' },
      { label: '叙事回放', href: '/narratives/replay' },
      { label: '叙事对比', href: '/narratives/compare' },
    ]
  },
  { 
    label: '告警', 
    href: '/alerts', 
    icon: Bell,
    children: [
      { label: '冲击检测', href: '/alerts/shock' },
      { label: '背离检测', href: '/alerts/divergence' },
      { label: '自定义告警', href: '/alerts/custom' },
    ]
  },
  { 
    label: '洞察', 
    href: '/insights', 
    icon: Lightbulb,
    children: [
      { label: '每日简报', href: '/insights/daily' },
      { label: '周度报告', href: '/insights/weekly' },
      { label: '主题探索', href: '/insights/theme' },
    ]
  },
  { 
    label: '数据', 
    href: '/data', 
    icon: Database,
    children: [
      { label: '数据源', href: '/data/sources' },
      { label: '实体库', href: '/data/entities' },
      { label: '全局时间线', href: '/data/timeline' },
      { label: 'API 控制台', href: '/data/api' },
    ]
  },
  { label: '设置', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-terminal-medium-gray bg-terminal-black text-foreground transition-transform">
      <div className="flex h-16 items-center border-b border-terminal-medium-gray px-6">
        <span className="text-xl font-bold tracking-wider text-terminal-amber font-mono">NARRATIVE OS</span>
      </div>

      <div className="h-[calc(100vh-4rem)] overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.href} className="group relative">
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:bg-terminal-medium-gray hover:text-terminal-green",
                  pathname.startsWith(item.href) ? "bg-terminal-medium-gray text-terminal-green" : "text-gray-400"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                )}
              </Link>

              {/* Hover Menu */}
              {item.children && (
                <div className="absolute left-full top-0 ml-1 hidden w-48 rounded-sm border border-terminal-medium-gray bg-terminal-dark-gray p-2 shadow-lg group-hover:block z-50">
                  <div className="mb-2 px-2 text-xs font-semibold text-terminal-light-gray uppercase tracking-wider">
                    {item.label}
                  </div>
                  <ul className="space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link 
                          href={child.href}
                          className={cn(
                            "block rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-terminal-medium-gray hover:text-terminal-green",
                            pathname === child.href ? "bg-terminal-medium-gray text-terminal-green" : "text-gray-300"
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
