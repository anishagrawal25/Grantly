import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  FolderArchive,
  KeyRound,
  LayoutDashboard,
  ListTodo,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';

const TABS = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/discover', label: 'Discover', icon: Compass },
  { path: '/unlock', label: 'Unlock', icon: KeyRound, isUnlock: true },
  { path: '/wallet', label: 'Wallet', icon: FolderArchive },
  { path: '/tracker', label: 'Tracker', icon: ListTodo },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const onboarded = useAppStore((state) => state.onboarded);

  // Hide on landing or onboarding
  if (!onboarded || location.pathname === '/' || location.pathname === '/onboarding') {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-lg border-t border-line z-40 px-2 py-1.5 shadow-lg safe-area-bottom"
    >
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={clsx(
                'flex flex-col items-center justify-center min-w-[56px] py-1 rounded-xl transition-colors min-h-[44px]',
                isActive
                  ? tab.isUnlock
                    ? 'text-unlock-600 font-bold'
                    : 'text-brand-600 font-bold'
                  : 'text-ink-500 hover:text-ink-900',
              )}
            >
              <div
                className={clsx(
                  'p-1 rounded-lg transition-transform',
                  isActive &&
                    (tab.isUnlock ? 'bg-unlock-50' : 'bg-brand-50 scale-105'),
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
