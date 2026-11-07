import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  BookmarkCheck,
  Compass,
  ExternalLink,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { CriteriaList } from '../components/scholarships/CriteriaList';
import { DocChecklist } from '../components/scholarships/DocChecklist';
import { MatchBadge } from '../components/scholarships/MatchBadge';
import { DeadlinePill } from '../components/tracker/DeadlinePill';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { useMatches } from '../hooks/useMatches';
import { getDaysRemaining } from '../lib/dates';
import { formatINR } from '../lib/money';
import { useAppStore } from '../store/useAppStore';
import { ApplicationStage } from '../types';
import NotFound from './NotFound';

const STAGE_OPTIONS = [
  { value: 'saved', label: 'Saved (Bookmark)' },
  { value: 'preparing', label: 'Preparing Documents' },
  { value: 'applied', label: 'Application Submitted' },
  { value: 'awarded', label: 'Grant Awarded 🎉' },
  { value: 'rejected', label: 'Application Rejected' },
];

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const deadlines = useAppStore((state) => state.deadlines);
  const applications = useAppStore((state) => state.applications);
  const saveScholarship = useAppStore((state) => state.saveScholarship);
  const setStage = useAppStore((state) => state.setStage);
  const setFilters = useAppStore((state) => state.setFilters);

  const { byId } = useMatches();

  const [explainSimply, setExplainSimply] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  if (!id || !byId[id]) {
    return <NotFound />;
  }

  const { scholarship, match } = byId[id];

  const currentApp = applications.find((a) => a.scholarshipId === scholarship.id);
  const isSaved = Boolean(currentApp);

  const daysRemaining = deadlines[scholarship.id]
    ? getDaysRemaining(deadlines[scholarship.id])
    : scholarship.deadlineInDays;

  const handleSaveAndApply = () => {
    saveScholarship(scholarship.id, 'preparing');
    setToast({
      id: String(Date.now()),
      tone: 'success',
      title: 'Saved to Application Tracker',
      message: `${scholarship.name} is now in your tracker under 'Preparing'.`,
    });
  };

  const handleSaveForLater = () => {
    saveScholarship(scholarship.id, 'saved');
    setToast({
      id: String(Date.now()),
      tone: 'info',
      title: 'Saved for later',
      message: 'You can review this anytime in your tracker.',
    });
  };

  const handleStageChange = (newStage: ApplicationStage) => {
    setStage(scholarship.id, newStage);
    setToast({
      id: String(Date.now()),
      tone: 'success',
      title: 'Status Updated',
      message: `Moved to ${newStage.toUpperCase()}.`,
    });
  };

  const handleSeeSimilar = () => {
    setFilters({ status: 'eligible', query: '' });
    navigate('/discover');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 sm:py-4 pb-28 lg:pb-8">
      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to scholarships
      </Button>

      {/* Grid: Main Column (8 cols) + Sticky Action Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
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

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight leading-snug">
              {scholarship.name}
            </h1>
            <p className="text-sm sm:text-base text-ink-500 mt-1">
              Offered by {scholarship.provider}
            </p>

            {/* Financial Amount */}
            <div className="mt-5 pt-5 border-t border-line flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  Approved Financial Grant
                </span>
                <div className="font-money text-3xl sm:text-4xl font-bold text-forest-900 tabular-nums">
                  {formatINR(scholarship.amount)}
                  <span className="text-xs sm:text-sm font-normal text-ink-500 font-sans ml-2">
                    per academic year
                  </span>
                </div>
              </div>

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

            {/* Explain Simply Toggle & Overview */}
            <div className="mt-6 pt-6 border-t border-line">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-900 font-display">
                  Overview
                </span>
                <button
                  type="button"
                  onClick={() => setExplainSimply(!explainSimply)}
                  className={clsx(
                    'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all select-none',
                    explainSimply
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-surface border-line text-ink-700 hover:border-ink-300',
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Explain simply {explainSimply ? '✓' : ''}</span>
                </button>
              </div>

              <div
                className={clsx(
                  'p-4 sm:p-5 rounded-2xl transition-all',
                  explainSimply
                    ? 'bg-brand-50/60 border border-brand-200/80 text-brand-900'
                    : 'bg-canvas/60 border border-line text-ink-700',
                )}
              >
                <p className="text-sm sm:text-base leading-relaxed">
                  {explainSimply
                    ? scholarship.plainSummary
                    : scholarship.shortDescription}
                </p>
              </div>
            </div>
          </Card>

          {/* Eligibility Breakdown */}
          <Card className="p-6 sm:p-8 bg-surface border-line shadow-card">
            <div className="mb-6">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-display">
                Direct Match Intelligence
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mt-0.5">
                Eligibility Requirements
              </h2>
              <p className="text-xs sm:text-sm text-ink-500 mt-1">
                Detailed comparison of your student profile with official criteria.
              </p>
            </div>

            <CriteriaList
              criteria={match.criteria}
              onUnlockClick={() => navigate('/unlock')}
            />
          </Card>

          {/* Required Documents */}
          <Card className="p-6 sm:p-8 bg-surface border-line shadow-card">
            <div className="mb-6">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-display">
                Application Portfolio
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mt-0.5">
                Required Documents
              </h2>
              <p className="text-xs sm:text-sm text-ink-500 mt-1">
                Tick what you have. Updates reflect across Grantly automatically.
              </p>
            </div>

            <DocChecklist requiredDocs={scholarship.requiredDocs} />
          </Card>

          {/* How to Apply */}
          <Card className="p-6 sm:p-8 bg-surface border-line shadow-card">
            <div className="mb-6">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-display">
                Official Roadmap
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mt-0.5">
                How to Apply
              </h2>
              <p className="text-xs sm:text-sm text-ink-500 mt-1">
                Follow these verified steps on the official scholarship portal.
              </p>
            </div>

            <div className="space-y-3.5">
              {scholarship.howToApply.map((stepText, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-canvas/60 border border-line"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
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

        {/* Right Sticky Sidebar (Desktop >= 1024px) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-4">
          <Card className="p-6 bg-surface border-line shadow-card">
            <h3 className="text-base font-bold text-ink-900 mb-4 pb-3 border-b border-line">
              Application Actions
            </h3>

            {/* Saved State Management */}
            {isSaved ? (
              <div className="space-y-4 mb-5">
                <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-brand-700">
                  <BookmarkCheck className="w-4 h-4 text-brand-600" />
                  <span>Tracked in your Application Roadmap</span>
                </div>

                <Select
                  label="Update Application Stage"
                  value={currentApp?.stage || 'saved'}
                  onChange={(e) =>
                    handleStageChange(e.target.value as ApplicationStage)
                  }
                  options={STAGE_OPTIONS}
                />
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                {match.status === 'eligible' && (
                  <Button
                    variant="primary"
                    onClick={handleSaveAndApply}
                    className="w-full font-bold"
                  >
                    Save & Start Application
                  </Button>
                )}

                {match.status === 'almost' && (
                  <>
                    <Button
                      variant="unlock"
                      onClick={() => navigate('/unlock')}
                      leftIcon={<KeyRound className="w-4 h-4" />}
                      className="w-full font-bold"
                    >
                      Unlock This Scholarship
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSaveForLater}
                      className="w-full text-sm"
                    >
                      Save for Later
                    </Button>
                  </>
                )}

                {match.status === 'not-eligible' && (
                  <>
                    <Button
                      variant="secondary"
                      disabled
                      className="w-full text-ink-500 bg-ink-100/50 cursor-not-allowed"
                    >
                      Not Eligible (Criteria Mismatch)
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSeeSimilar}
                      leftIcon={<Compass className="w-4 h-4" />}
                      className="w-full text-sm font-semibold"
                    >
                      See Scholarships You Qualify For
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Official Portal External Link */}
            <div className="pt-4 border-t border-line">
              <a
                href={scholarship.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="secondary"
                  className="w-full text-xs font-medium justify-between"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5 text-ink-500" />}
                >
                  Visit Official Provider Portal
                </Button>
              </a>
              <p className="text-[11px] text-ink-500 text-center mt-2">
                External official link opens in a new tab.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Dock (Mobile Only < 1024px) */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 p-3 bg-surface/95 backdrop-blur-md border-t border-line z-30 shadow-pop">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {isSaved ? (
            <div className="flex-1">
              <Select
                value={currentApp?.stage || 'saved'}
                onChange={(e) =>
                  handleStageChange(e.target.value as ApplicationStage)
                }
                options={STAGE_OPTIONS}
              />
            </div>
          ) : match.status === 'eligible' ? (
            <Button
              variant="primary"
              onClick={handleSaveAndApply}
              className="flex-1 font-bold text-sm"
            >
              Save & Start Application
            </Button>
          ) : match.status === 'almost' ? (
            <Button
              variant="unlock"
              onClick={() => navigate('/unlock')}
              leftIcon={<KeyRound className="w-4 h-4" />}
              className="flex-1 font-bold text-sm"
            >
              Unlock Grant
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSeeSimilar}
              className="flex-1 text-sm font-semibold"
            >
              See Matching Grants
            </Button>
          )}

          <a
            href={scholarship.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="md" aria-label="Official Website">
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
