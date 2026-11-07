import React from 'react';
import clsx from 'clsx';

export interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  selected = false,
  onClick,
  icon,
  children,
  className,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 select-none min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed',
        selected
          ? 'bg-brand-50 border-brand-500 text-brand-700 font-semibold shadow-xs'
          : 'bg-surface border-line text-ink-700 hover:border-ink-300 hover:text-ink-900',
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};
