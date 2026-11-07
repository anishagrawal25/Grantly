import React from 'react';
import clsx from 'clsx';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8',
        className,
      )}
    >
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-ink-900 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm sm:text-base text-ink-500 mt-1 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
};

