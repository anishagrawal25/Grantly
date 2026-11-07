import React from 'react';
import { AlertCircle, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { Application, Scholarship } from '../../types';
import { getDaysRemaining } from '../../lib/dates';

export type RadarFilter = 'all' | 'week' | 'month' | 'later';

export interface DeadlineRadarProps {
  applications: Application[];
  deadlines: Record<string, string>;
  scholarshipsById: Record<string, { scholarship: Scholarship }>;
  activeFilter: RadarFilter;
  onSelectFilter: (filter: RadarFilter) => void;
  className?: string;
}

export const DeadlineRadar: React.FC<DeadlineRadarProps> = ({
  applications,
  deadlines,
  scholarshipsById,
  activeFilter,
  onSelectFilter,
  className,
}) => {
  // Group applications by deadline bucket
  let dueThisWeekCount = 0;
  let dueThisMonthCount = 0;
  let dueLaterCount = 0;

  applications.forEach((app) => {
    const item = scholarshipsById[app.scholarshipId];
    if (!item) return;

    const days = deadlines[app.scholarshipId]
      ? getDaysRemaining(deadlines[app.scholarshipId])
      : item.scholarship.deadlineInDays;

    if (days >= 0 && days <= 7) {
      dueThisWeekCount += 1;
    } else if (days > 7 && days <= 30) {
      dueThisMonthCount += 1;
    } else if (days > 30) {
      dueLaterCount += 1;
    }
  });

  const buckets: {
    id: RadarFilter;
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    activeClass: string;
    badgeClass: string;
    textClass: string;
  }[] = [
    {
      id: 'all',
      label: 'All Active',
      count: applications.length,
      icon: CheckCircle2,
      activeClass: 'bg-forest-900 text-white shadow-xs',
      badgeClass: 'bg-white/20 text-white',
      textClass: 'text-ink-700 hover:text-forest-900',
    },
    {
      id: 'week',
      label: 'Due this week',
      count: dueThisWeekCount,
      icon: AlertCircle,
      activeClass: 'bg-danger-600 text-white shadow-xs',
      badgeClass: 'bg-white/20 text-white',
      textClass: 'text-danger-700 hover:bg-danger-50',
    },
    {
      id: 'month',
      label: 'Due this month',
      count: dueThisMonthCount,
      icon: Clock,
      activeClass: 'bg-unlock-600 text-white shadow-xs',
      badgeClass: 'bg-white/20 text-white',
      textClass: 'text-unlock-700 hover:bg-unlock-50',
    },
    {
      id: 'later',
      label: 'Later / 30+ days',
      count: dueLaterCount,
      icon: Calendar,
      activeClass: 'bg-brand-600 text-white shadow-xs',
      badgeClass: 'bg-white/20 text-white',
      textClass: 'text-brand-700 hover:bg-brand-50',
    },
  ];

  return (
    <div
      className={clsx(
        'bg-surface rounded-2xl border border-line p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-forest-900 uppercase tracking-wider font-display shrink-0">
          Deadline Radar:
        </span>
        <span className="text-xs text-ink-500 hidden lg:inline">
          Filter deadlines to prioritize time-sensitive applications
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {buckets.map((bucket) => {
          const Icon = bucket.icon;
          const isActive = activeFilter === bucket.id;

          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() => onSelectFilter(bucket.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 select-none border border-transparent',
                isActive
                  ? bucket.activeClass
                  : clsx('bg-canvas/80 border-line hover:border-line/80', bucket.textClass),
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{bucket.label}</span>
              <span
                className={clsx(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isActive ? bucket.badgeClass : 'bg-ink-200/60 text-ink-700',
                )}
              >
                {bucket.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

