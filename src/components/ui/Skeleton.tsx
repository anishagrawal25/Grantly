import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'xl',
  ...props
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-ink-300/30',
        roundedClasses[rounded],
        className,
      )}
      {...props}
    />
  );
};

