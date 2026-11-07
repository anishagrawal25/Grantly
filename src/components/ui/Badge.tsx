import React from 'react';
import clsx from 'clsx';

export type BadgeTone = 'brand' | 'unlock' | 'neutral' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center font-medium rounded-full border select-none transition-colors';

  const toneClasses: Record<BadgeTone, string> = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    unlock: 'bg-unlock-50 text-unlock-600 border-unlock-100',
    neutral: 'bg-ink-100 text-ink-700 border-line',
    danger: 'bg-danger-50 text-danger-600 border-rose-200',
    info: 'bg-info-50 text-info-500 border-blue-200',
  };

  const dotClasses: Record<BadgeTone, string> = {
    brand: 'bg-brand-500',
    unlock: 'bg-unlock-500',
    neutral: 'bg-ink-500',
    danger: 'bg-danger-500',
    info: 'bg-info-500',
  };

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={clsx(baseClasses, toneClasses[tone], sizeClasses[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotClasses[tone])}
        />
      )}
      {children}
    </span>
  );
};
