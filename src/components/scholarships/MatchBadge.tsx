import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MatchStatus } from '../../types';

export interface MatchBadgeProps {
  status: MatchStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({
  status,
  size = 'md',
  className,
}) => {
  if (status === 'eligible') {
    return (
      <Badge tone="brand" size={size} className={className}>
        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>You qualify</span>
      </Badge>
    );
  }

  if (status === 'almost') {
    return (
      <Badge tone="unlock" size={size} className={className}>
        <AlertCircle className="w-3.5 h-3.5 text-unlock-600 shrink-0" />
        <span>Almost eligible</span>
      </Badge>
    );
  }

  return (
    <Badge tone="neutral" size={size} className={className}>
      <XCircle className="w-3.5 h-3.5 text-ink-500 shrink-0" />
      <span>Not a match</span>
    </Badge>
  );
};

