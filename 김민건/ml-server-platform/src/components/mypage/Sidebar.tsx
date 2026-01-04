'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  CreditCard,
  Key,
  Briefcase,
  Lock
} from 'lucide-react';
import { sidebarItems } from '@/data/navigation';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  GitBranch: <GitBranch className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Key: <Key className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-20 bg-card rounded-xl border border-border p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4 px-2">
          마이페이지
        </h2>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const isDisabled = item.disabled;

            return (
              <Link
                key={item.href}
                href={isDisabled ? '#' : item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border-l-2 border-primary-500'
                    : isDisabled
                    ? 'text-muted/50 cursor-not-allowed'
                    : 'text-muted hover:text-foreground hover:bg-card/80'
                }`}
                onClick={(e) => isDisabled && e.preventDefault()}
              >
                <span className={isActive ? 'text-primary-400' : ''}>
                  {iconMap[item.icon]}
                </span>
                <span className="flex-1">{item.labelKo}</span>
                {isDisabled && (
                  <Lock className="w-4 h-4 text-muted/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Coming Soon Notice */}
        <div className="mt-6 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
          <p className="text-xs text-muted">
            <span className="text-primary-400 font-medium">Coming Soon:</span>{' '}
            파이프라인, 팀즈, 구독 관리 기능이 곧 출시됩니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
