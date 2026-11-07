import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Compass,
  FileCheck2,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatINR } from '../../lib/money';
import { Application, DocumentId, MatchResult, Scholarship } from '../../types';
import { getDaysRemaining } from '../../lib/dates';

export interface TodaysActionProps {
  matches: MatchResult[];
  scholarships: Scholarship[];
  applications: Application[];
  deadlines: Record<string, string>;
  heldDocs: DocumentId[];
  unlockableTotal: number;
  almostCount: number;
}

export const TodaysAction: React.FC<TodaysActionProps> = ({
  matches,
  scholarships,
  applications,
  deadlines,
  heldDocs,
  unlockableTotal,
  almostCount,
}) => {
  const navigate = useNavigate();

  const sMap = new Map<string, Scholarship>(scholarships.map((s) => [s.id, s]));
  const appMap = new Map<string, Application>(
    applications.map((a) => [a.scholarshipId, a]),
  );

  // Priority 1: Eligible scholarship with closest upcoming deadline <= 14 days and missing documents
  const urgentWithMissingDocs = matches
    .filter((m) => {
      if (m.status !== 'eligible') return false;
      const app = appMap.get(m.scholarshipId);
      if (app?.stage === 'applied' || app?.stage === 'awarded') return false;
      const deadlineIso = deadlines[m.scholarshipId];
      if (!deadlineIso) return false;
      const days = getDaysRemaining(deadlineIso);
      return days >= 0 && days <= 14;
    })
    .map((m) => {
      const s = sMap.get(m.scholarshipId)!;
      const deadlineIso = deadlines[m.scholarshipId];
      const days = getDaysRemaining(deadlineIso);
      const missingCount = s.requiredDocs.filter(
        (doc) => !heldDocs.includes(doc),
      ).length;
      return { scholarship: s, days, missingCount };
    })
    .sort((a, b) => a.days - b.days)[0];

  // Priority 2: Unlockable opportunity
  const hasUnlock = unlockableTotal > 0 && almostCount > 0;

  if (urgentWithMissingDocs && urgentWithMissingDocs.missingCount > 0) {
    const { scholarship, days, missingCount } = urgentWithMissingDocs;
    return (
      <Card className="p-5 sm:p-6 bg-unlock-50/50 border border-unlock-500/30 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-unlock-500 text-white shrink-0 mt-0.5 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-unlock-600 uppercase tracking-wider">
                  Today's Priority Action
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-unlock-100 text-unlock-600">
                  {days} {days === 1 ? 'day left' : 'days left'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-ink-900 mt-1">
                Prepare documents for {scholarship.name}
              </h3>
              <p className="text-xs sm:text-sm text-ink-700 mt-0.5 max-w-2xl">
                You qualify for {formatINR(scholarship.amount)}, but still need {missingCount} {missingCount === 1 ? 'document' : 'documents'} ready in your Document Wallet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="unlock"
              onClick={() => navigate('/wallet')}
              rightIcon={<FileCheck2 className="w-4 h-4" />}
            >
              Open Document Wallet
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (hasUnlock) {
    return (
      <Card className="p-5 sm:p-6 bg-unlock-50/40 border border-unlock-500/25 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-unlock-500 text-white shrink-0 mt-0.5 shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-unlock-600 uppercase tracking-wider">
                Today's Priority Action
              </span>
              <h3 className="text-base sm:text-lg font-bold text-ink-900 mt-1">
                Unlock {formatINR(unlockableTotal)} in additional funding
              </h3>
              <p className="text-xs sm:text-sm text-ink-700 mt-0.5 max-w-2xl">
                You have {almostCount} scholarships within immediate reach. Complete one missing requirement to expand your funding picture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="unlock"
              onClick={() => navigate('/unlock')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review Unlock Steps
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Priority 3: Default Explore Action
  return (
    <Card className="p-5 sm:p-6 bg-brand-50/40 border border-brand-500/20 rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-600 text-white shrink-0 mt-0.5 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              Today's Recommendation
            </span>
            <h3 className="text-base sm:text-lg font-bold text-ink-900 mt-1">
              Explore your matching scholarship catalog
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 mt-0.5 max-w-2xl">
              Compare application procedures, deadlines, and requirements to save scholarships to your tracker.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            onClick={() => navigate('/discover')}
            rightIcon={<Compass className="w-4 h-4" />}
          >
            Explore Scholarships
          </Button>
        </div>
      </div>
    </Card>
  );
};
