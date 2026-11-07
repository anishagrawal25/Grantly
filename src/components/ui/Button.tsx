import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'unlock' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
      secondary:
        'bg-surface border border-line text-ink-900 hover:bg-canvas active:bg-ink-100 shadow-sm',
      ghost:
        'bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-300/40',
      unlock:
        'bg-unlock-500 text-white hover:bg-unlock-600 active:bg-unlock-600/90 shadow-sm',
      danger:
        'bg-danger-600 text-white hover:bg-danger-500 active:bg-danger-600/90 shadow-sm',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'text-sm px-3.5 py-1.5 gap-1.5',
      md: 'text-sm sm:text-base px-5 py-2.5 gap-2',
      lg: 'text-base sm:text-lg px-6 py-3.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

