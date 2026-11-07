import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';

export interface StatTileProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  to: string;
  tone?: 'brand' | 'unlock' | 'warning' | 'neutral';
  isAlert?: boolean;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  sublabel,
  icon,
  to,
  tone = 'neutral',
  isAlert = false,
}) => {
  const iconToneClasses = {
    brand: 'bg-brand-50 text-brand-600',
    unlock: 'bg-unlock-50 text-unlock-600',
    warning: 'bg-unlock-100 text-unlock-600',
    neutral: 'bg-ink-100 text-ink-700',
  };

  return (
    <Link to={to} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl">
      <Card
        interactive
        className={clsx(
          'p-4 sm:p-5 h-full flex flex-col justify-between border-line transition-all select-none',
          isAlert && 'border-unlock-500/50 bg-unlock-50/20',
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
          <div
            className={clsx(
              'p-2 sm:p-2.5 rounded-xl shrink-0 transition-colors',
              iconToneClasses[tone],
            )}
          >
            {icon}
          </div>
          <ArrowUpRight className="w-4 h-4 text-ink-300 group-hover:text-ink-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <div>
          <span className="text-xs font-medium text-ink-500 line-clamp-1">
            {label}
          </span>
          <div className="font-money text-2xl sm:text-3xl font-bold text-ink-900 mt-0.5 tabular-nums">
            {value}
          </div>
          {sublabel && (
            <p className="text-[11px] sm:text-xs text-ink-500 mt-1 line-clamp-1">
              {sublabel}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

