import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder,
      className,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-ink-900 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={clsx(
              'w-full min-h-[44px] px-3.5 py-2.5 pr-10 rounded-xl border bg-surface text-ink-900 text-sm sm:text-base appearance-none transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:bg-ink-100/50 disabled:cursor-not-allowed cursor-pointer',
              error
                ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
                : 'border-line hover:border-ink-300',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3.5 text-ink-500 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>
        {error ? (
          <p className="text-xs text-danger-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-ink-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';

