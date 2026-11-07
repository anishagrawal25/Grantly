import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import clsx from 'clsx';
import { MatchBadge } from './MatchBadge';
import { DeadlinePill } from '../tracker/DeadlinePill';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatINR } from '../../lib/money';
import { getDaysRemaining } from '../../lib/dates';
import { useAppStore } from '../../store/useAppStore';
import { MatchResult, Scholarship } from '../../types';

export interface ScholarshipCardProps {
  scholarship: Scholarship;
  match: MatchResult;
  deadlineIso?: string;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  match,
  deadlineIso,
}) => {
  const navigate = useNavigate();
  const applications = useAppStore((state) => state.applications);
  const saveScholarship = useAppStore((state) => state.saveScholarship);
  const removeApplication = useAppStore((state) => state.removeApplication);

  const isSaved = applications.some((a) => a.scholarshipId === scholarship.id);

  const daysRemaining = deadlineIso
    ? getDaysRemaining(deadlineIso)
    : scholarship.deadlineInDays;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeApplication(scholarship.id);
    } else {
      saveScholarship(scholarship.id, 'saved');
    }
  };

  const statusBorderClasses = {
    eligible: 'hover:border-brand-500/60',
    almost: 'hover:border-unlock-500/60',
    'not-eligible': 'hover:border-ink-300',
  };

  return (
    <Card
      interactive
      onClick={() => navigate(`/scholarship/${scholarship.id}`)}
      className={clsx(
        'p-5 sm:p-6 flex flex-col justify-between border-line transition-all group',
        statusBorderClasses[match.status],
      )}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-ink-700 bg-ink-100 px-2.5 py-0.5 rounded-full border border-line">
              {scholarship.providerType}
            </span>
            <MatchBadge status={match.status} size="sm" />
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={isSaved ? 'Remove bookmark' : 'Save scholarship'}
            className={clsx(
              'p-2 rounded-xl border transition-colors shrink-0',
              isSaved
                ? 'bg-brand-50 border-brand-200 text-brand-600'
                : 'bg-surface border-line text-ink-300 hover:text-ink-700 hover:border-ink-300',
            )}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 fill-brand-600" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Name and Provider */}
        <h3 className="text-base sm:text-lg font-bold text-ink-900 line-clamp-2 leading-snug group-hover:text-brand-700 transition-colors mb-1">
          {scholarship.name}
        </h3>
        <p className="text-xs text-ink-500 line-clamp-1 mb-4">
          {scholarship.provider}
        </p>

        {/* Amount */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
            Annual Support
          </span>
          <div className="font-money text-2xl sm:text-3xl font-bold text-forest-900 tabular-nums">
            {formatINR(scholarship.amount)}
            <span className="text-xs font-normal text-ink-500 font-sans ml-1">
              / year
            </span>
          </div>
        </div>

        {/* Reason Headline Banner */}
        <div
          className={clsx(
            'p-2.5 rounded-xl text-xs line-clamp-2 mb-4 border',
            match.status === 'eligible' &&
              'bg-brand-50/70 border-brand-100 text-brand-900',
            match.status === 'almost' &&
              'bg-unlock-50 border-unlock-100 text-unlock-600 font-medium',
            match.status === 'not-eligible' &&
              'bg-ink-100/50 border-line text-ink-700',
          )}
        >
          {match.headline}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-line flex items-center justify-between gap-2">
        <DeadlinePill daysRemaining={daysRemaining} />

        <Button
          size="sm"
          variant={match.status === 'almost' ? 'unlock' : 'secondary'}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/scholarship/${scholarship.id}`);
          }}
          className="text-xs font-semibold"
        >
          {match.status === 'almost' ? 'Unlock Steps' : 'View Details'}
        </Button>
      </div>
    </Card>
  );
};

