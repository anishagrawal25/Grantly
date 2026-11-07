import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CriteriaList } from '../components/scholarships/CriteriaList';
import { DocChecklist } from '../components/scholarships/DocChecklist';
import { MatchBadge } from '../components/scholarships/MatchBadge';
import { DeadlinePill } from '../components/tracker/DeadlinePill';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useMatches } from '../hooks/useMatches';
import { getDaysRemaining } from '../lib/dates';
import { formatINR } from '../../src/lib/money';
import { useAppStore } from '../store/useAppStore';
import NotFound from './NotFound';

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deadlines = useAppStore((state) => state.deadlines);

  const { byId } = useMatches();

  if (!id || !byId[id]) {
    return <NotFound />;
  }

  const { scholarship, match } = byId[id];

  const daysRemaining = deadlines[scholarship.id]
    ? getDaysRemaining(deadlines[scholarship.id])
    : scholarship.deadlineInDays;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto py-2 sm:py-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to scholarships
      </Button>

      {/* Main Header Card */}
      <Card className="p-6 sm:p-8 bg-surface border-line shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-700 bg-ink-100 px-3 py-1 rounded-full border border-line">
              {scholarship.providerType}
            </span>
            <MatchBadge status={match.status} />
          </div>

          <DeadlinePill daysRemaining={daysRemaining} />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-ink-900 tracking-tight leading-snug">
          {scholarship.name}
        </h1>
        <p className="text-sm sm:text-base text-ink-500 mt-1">
          Offered by {scholarship.provider}
        </p>

        {/* Amount Hero in Detail */}
        <div className="mt-6 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Approved Financial Grant
            </span>
            <div className="font-money text-3xl sm:text-5xl font-bold text-forest-900 tabular-nums">
              {formatINR(scholarship.amount)}
              <span className="text-sm font-normal text-ink-500 font-sans ml-2">
                per academic year
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto mt-2 sm:mt-0">
            {scholarship.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium bg-canvas px-2.5 py-1 rounded-lg text-ink-700 border border-line"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Eligibility Breakdown Section */}
      <Card className="p-6 sm:p-8 bg-surface border-line shadow-card">
        <div className="mb-6">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-display">
            Direct Match Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mt-0.5">
            Eligibility Requirements
          </h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Detailed breakdown comparing your student profile against the official provider criteria.
          </p>
        </div>

        <CriteriaList
          criteria={match.criteria}
          onUnlockClick={() => navigate('/unlock')}
        />
      </Card>

      {/* Required Documents Section */}
      <Card className="p-6 sm:p-8 bg-surface border-line shadow-card">
        <div className="mb-6">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-display">
            Application Portfolio
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mt-0.5">
            Required Documents
          </h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Certificates and identification needed for official portal verification.
          </p>
        </div>

        <DocChecklist requiredDocs={scholarship.requiredDocs} />
      </Card>

      {/* How to Apply Section */}
      <Card className="p-6 sm:p-8 bg-surface border-line shadow-card">
        <div className="mb-6">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-display">
            Official Roadmap
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mt-0.5">
            How to Apply
          </h2>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Follow these verified submission steps on the provider's official portal.
          </p>
        </div>

        <div className="space-y-4">
          {scholarship.howToApply.map((stepText, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-canvas/60 border border-line"
            >
              <div className="w-8 h-8 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-ink-900 leading-relaxed">
                  {stepText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
