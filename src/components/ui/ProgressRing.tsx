import React from 'react';
import clsx from 'clsx';

export interface ProgressRingProps {
  percentage: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  tone?: 'brand' | 'unlock' | 'forest';
  className?: string;
  showPercentage?: boolean;
  label?: string;
  sublabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  tone = 'brand',
  className,
  showPercentage = true,
  label,
  sublabel,
}) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const toneStroke = {
    brand: 'stroke-brand-500',
    unlock: 'stroke-unlock-500',
    forest: 'stroke-forest-600',
  };

  const toneBg = {
    brand: 'stroke-brand-50',
    unlock: 'stroke-unlock-50',
    forest: 'stroke-forest-800',
  };

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={clsx('transition-all duration-300', toneBg[tone])}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={clsx('transition-all duration-700 ease-out', toneStroke[tone])}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
        {showPercentage && (
          <span className="font-money font-bold text-lg sm:text-xl text-ink-900 tabular-nums">
            {Math.round(clamped)}%
          </span>
        )}
        {label && (
          <span className="text-[10px] sm:text-xs font-semibold text-ink-700 leading-tight">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[9px] text-ink-500 leading-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
