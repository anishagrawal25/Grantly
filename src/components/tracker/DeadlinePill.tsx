import React from 'react';
import { Clock } from 'lucide-react';
import clsx from 'clsx';
import { getDeadlineUrgency } from '../../lib/dates';

export interface DeadlinePillProps {
  daysRemaining: number;
  className?: string;
  showIcon?: boolean;
}

export const DeadlinePill: React.FC<DeadlinePillProps> = ({
  daysRemaining,
  className,
  showIcon = true,
}) => {
  const urgency = getDeadlineUrgency(daysRemaining);

  const urgencyClasses = {
    urgent: 'bg-danger-50 text-danger-600 border-rose-200 font-semibold',
    warning: 'bg-unlock-50 text-unlock-600 border-unlock-100 font-medium',
    safe: 'bg-brand-50 text-brand-700 border-brand-100 font-medium',
  };

  const displayText =
    daysRemaining <= 0
      ? 'Deadline passed'
      : daysRemaining === 1
        ? '1 day left'
        : `${daysRemaining} days left`;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border select-none transition-colors',
        urgencyClasses[urgency],
        className,
      )}
    >
      {showIcon && <Clock className="w-3 h-3 shrink-0" />}
      <span>{displayText}</span>
    </span>
  );
};
