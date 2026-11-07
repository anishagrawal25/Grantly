import React from 'react';
import clsx from 'clsx';

export type IllustrationType = 'coins' | 'document' | 'calendar' | 'search';

export interface EmptyStateProps {
  illustration?: IllustrationType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration = 'search',
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-surface/50 border border-dashed border-line',
        className,
      )}
    >
      <div className="w-20 h-20 mb-4 flex items-center justify-center">
        {illustration === 'coins' && (
          <svg
            className="w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base coin */}
            <ellipse cx="32" cy="46" rx="20" ry="8" fill="#C9D1CB" />
            <path
              d="M12 46V50C12 54.4 20.9 58 32 58C43.1 58 52 54.4 52 50V46"
              fill="#10B981"
            />
            {/* Middle coin */}
            <ellipse cx="32" cy="36" rx="20" ry="8" fill="#FDEBBD" />
            <path
              d="M12 36V40C12 44.4 20.9 48 32 48C43.1 48 52 44.4 52 40V36"
              fill="#F2A516"
            />
            {/* Top coin */}
            <ellipse cx="32" cy="24" rx="20" ry="8" fill="#D1FAE5" />
            <ellipse cx="32" cy="24" rx="15" ry="5.5" stroke="#059669" strokeWidth="2" />
          </svg>
        )}

        {illustration === 'document' && (
          <svg
            className="w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background folder / paper */}
            <rect x="18" y="10" width="32" height="42" rx="4" fill="#EEF1EC" stroke="#C9D1CB" strokeWidth="2" />
            <rect x="14" y="14" width="32" height="42" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
            <line x1="20" y1="24" x2="38" y2="24" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="32" x2="34" y2="32" stroke="#6B7A72" strokeWidth="2" strokeLinecap="round" />
            <circle cx="36" cy="44" r="8" fill="#D1FAE5" />
            <path d="M33 44L35 46L39 42" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}

        {illustration === 'calendar' && (
          <svg
            className="w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="14" y="16" width="36" height="36" rx="6" fill="#FFFFFF" stroke="#C77F00" strokeWidth="2" />
            <rect x="14" y="16" width="36" height="12" rx="6" fill="#FDEBBD" />
            <line x1="22" y1="12" x2="22" y2="18" stroke="#C77F00" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="12" x2="42" y2="18" stroke="#C77F00" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="38" r="6" fill="#FFF8E6" stroke="#F2A516" strokeWidth="2" />
            <path d="M32 35V38L34 39" stroke="#C77F00" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}

        {illustration === 'search' && (
          <svg
            className="w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="28" cy="28" r="14" fill="#ECFDF5" stroke="#10B981" strokeWidth="3" />
            <line x1="38" y1="38" x2="50" y2="50" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="28" cy="28" r="7" stroke="#3A4A42" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        )}
      </div>

      <h4 className="text-base sm:text-lg font-bold text-ink-900 mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs sm:text-sm text-ink-500 max-w-sm mb-5">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
