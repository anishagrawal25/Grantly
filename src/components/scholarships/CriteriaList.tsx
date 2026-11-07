import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { CriterionResult } from '../../types';

export interface CriteriaListProps {
  criteria: CriterionResult[];
  className?: string;
  onUnlockClick?: (step?: string) => void;
}

export const CriteriaList: React.FC<CriteriaListProps> = ({
  criteria,
  className,
  onUnlockClick,
}) => {
  if (criteria.length === 0) {
    return (
      <div className="p-4 bg-surface rounded-xl border border-line text-sm text-ink-700">
        This scholarship has open eligibility with no categorical restrictions.
      </div>
    );
  }

  return (
    <div className={clsx('space-y-3', className)}>
      {criteria.map((c) => {
        const isPass = c.state === 'pass';
        const isUnverified = c.state === 'unverified';
        const isFail = c.state === 'fail';

        return (
          <div
            key={c.key}
            className={clsx(
              'p-4 rounded-xl border transition-colors',
              isPass && 'bg-surface border-line',
              isUnverified && 'bg-unlock-50/60 border-unlock-200',
              isFail && 'bg-surface border-line/80',
            )}
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="mt-0.5 shrink-0">
                {isPass && (
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                )}
                {isUnverified && (
                  <AlertTriangle className="w-5 h-5 text-unlock-600" />
                )}
                {isFail && (
                  <XCircle className="w-5 h-5 text-ink-300" />
                )}
              </div>

              {/* Label and Detail */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-ink-900">
                    {c.label}
                  </h4>
                  <span
                    className={clsx(
                      'text-xs font-medium px-2 py-0.5 rounded-md select-none',
                      isPass && 'bg-brand-50 text-brand-700',
                      isUnverified && 'bg-unlock-100 text-unlock-600 font-semibold',
                      isFail && 'bg-ink-100 text-ink-500',
                    )}
                  >
                    {isPass
                      ? 'Requirement Met'
                      : isUnverified
                        ? 'Verification Needed'
                        : 'Not Met'}
                  </span>
                </div>

                <p
                  className={clsx(
                    'text-xs sm:text-sm mt-0.5',
                    isPass
                      ? 'text-ink-700'
                      : isUnverified
                        ? 'text-unlock-600 font-medium'
                        : 'text-ink-500',
                  )}
                >
                  {c.detail}
                </p>

                {/* Closable Next Step Callout */}
                {c.nextStep && (
                  <div className="mt-3 p-3 bg-unlock-100/70 border border-unlock-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-unlock-500 text-white px-1.5 py-0.5 rounded">
                        Action to Unlock
                      </span>
                      <span className="text-xs font-semibold text-unlock-600">
                        {c.nextStep}
                      </span>
                    </div>

                    {onUnlockClick && (
                      <button
                        type="button"
                        onClick={() => onUnlockClick(c.nextStep)}
                        className="text-xs font-bold text-unlock-600 hover:text-unlock-500 inline-flex items-center gap-1 self-start sm:self-auto"
                      >
                        <span>Fix this requirement</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
