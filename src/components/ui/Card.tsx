import React, { forwardRef } from 'react';
import clsx from 'clsx';

export type CardVariant = 'default' | 'surface' | 'hero' | 'unlock' | 'outline';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      interactive = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = 'rounded-2xl transition-all duration-200 relative overflow-hidden';

    const variantClasses: Record<CardVariant, string> = {
      default: 'bg-surface border border-line shadow-card text-ink-900',
      surface: 'bg-surface text-ink-900 border border-line',
      hero: 'bg-forest-900 text-white shadow-pop border border-forest-800',
      unlock: 'bg-unlock-50 border border-unlock-100 text-ink-900 shadow-card',
      outline: 'bg-transparent border border-line text-ink-900',
    };

    const interactiveClasses = interactive
      ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          interactiveClasses,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
