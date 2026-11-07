import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  FolderArchive,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  ListTodo,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/discover', label: 'Discover', icon: Compass },
  { path: '/unlock', label: 'Unlock', icon: KeyRound, isUnlock: true },
  { path: '/wallet', label: 'Wallet', icon: FolderArchive },
  { path: '/tracker', label: 'Tracker', icon: ListTodo },
];

export const TopNav: React.FC = () => {
  const location = useLocation();
  const profile = useAppStore((state) => state.profile);
  const onboarded = useAppStore((state) => state.onboarded);

  // If on landing or onboarding, show clean header
  const isAuthOrLanding =
    location.pathname === '/' || location.pathname === '/onboarding';

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-line transition-all">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={onboarded ? '/dashboard' : '/'}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-forest-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-brand-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-tight tracking-tight text-ink-900">
              Grantly
            </span>
            <span className="text-[10px] font-medium tracking-wide text-ink-500 hidden sm:inline">
              Funding Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {!isAuthOrLanding && onboarded && (
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-ink-100/50 p-1 rounded-xl border border-line/60"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? item.isUnlock
                        ? 'bg-surface text-unlock-600 font-semibold shadow-xs'
                        : 'bg-surface text-brand-700 font-semibold shadow-xs'
                      : 'text-ink-700 hover:text-ink-900 hover:bg-surface/60',
                  )}
                >
                  <Icon
                    className={clsx(
                      'w-4 h-4',
                      isActive
                        ? item.isUnlock
                          ? 'text-unlock-600'
                          : 'text-brand-600'
                        : 'text-ink-500',
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Action / Profile */}
        <div className="flex items-center gap-3">
          {onboarded && profile ? (
            <Link
              to="/profile"
              className={clsx(
                'flex items-center gap-2.5 p-1.5 pr-3 rounded-full border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                location.pathname === '/profile'
                  ? 'border-brand-500 bg-brand-50/60'
                  : 'border-line bg-surface hover:bg-canvas',
              )}
            >
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-ink-900 max-w-[100px] truncate hidden sm:inline">
                {profile.name.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/onboarding"
              className="text-xs sm:text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-100 px-3.5 py-2 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
