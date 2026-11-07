import React from 'react';
import { ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatINR } from '../../lib/money';
import { Scholarship } from '../../types';

export interface UnlockGroup {
  actionType: 'income' | 'marks' | 'other';
  nextStep: string;
  totalAmount: number;
  scholarships: Scholarship[];
  marksGap?: number;
  requiredMarks?: number;
}

export interface UnlockCardProps {
  group: UnlockGroup;
  onActionClick: (group: UnlockGroup) => void;
}

export const UnlockCard: React.FC<UnlockCardProps> = ({
  group,
  onActionClick,
}) => {
  return (
    <Card className="p-6 sm:p-7 bg-unlock-50/70 border-2 border-unlock-500/40 rounded-2xl shadow-card relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-unlock-100/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Header Tag */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-unlock-500 text-white shadow-xs">
              <KeyRound className="w-3.5 h-3.5" />
              <span>1 Requirement Missing</span>
            </span>

            <span className="text-xs font-semibold text-unlock-600 bg-unlock-100/80 px-2.5 py-0.5 rounded-md">
              {group.scholarships.length}{' '}
              {group.scholarships.length === 1 ? 'scholarship' : 'scholarships'}
            </span>
          </div>

          {/* Amount to Unlock */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Unlockable Value
            </span>
            <div className="font-money text-3xl sm:text-4xl font-bold text-forest-900 tabular-nums">
              {formatINR(group.totalAmount)}
              <span className="text-xs font-normal text-ink-500 font-sans ml-1.5">
                / year
              </span>
            </div>
          </div>

          {/* Next Step Banner */}
          <div className="p-3.5 bg-surface/90 border border-unlock-200 rounded-xl mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-unlock-600">
              Action Required
            </span>
            <p className="text-sm font-bold text-ink-900 mt-0.5">
              {group.nextStep}
            </p>
          </div>

          {/* Affected Scholarships List */}
          <div className="space-y-1.5 mb-6">
            <span className="text-xs font-semibold text-ink-500">
              Unlocks these schemes:
            </span>
            {group.scholarships.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-surface/50 border border-line"
              >
                <span className="font-medium text-ink-900 truncate max-w-[70%]">
                  {s.name}
                </span>
                <span className="font-money font-bold text-forest-900">
                  {formatINR(s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-unlock-200/80 flex items-center justify-between gap-3">
          <span className="text-xs text-ink-500 hidden sm:inline">
            Live preview update
          </span>

          <Button
            variant="unlock"
            onClick={() => onActionClick(group)}
            rightIcon={
              group.actionType === 'income' ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )
            }
            className="w-full sm:w-auto font-bold text-sm shadow-xs"
          >
            {group.actionType === 'income'
              ? 'I have an income certificate now'
              : group.actionType === 'marks'
                ? 'Update my marks'
                : 'Fix requirement'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

