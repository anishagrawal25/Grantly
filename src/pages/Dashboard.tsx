import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarClock,
  Clock,
  FolderArchive,
  GraduationCap,
  KeyRound,
  ListTodo,
} from 'lucide-react';
import { MoneyMeter } from '../components/money/MoneyMeter';
import { StatTile } from '../components/money/StatTile';
import { TodaysAction } from '../components/money/TodaysAction';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useMatches } from '../hooks/useMatches';
import { formatINR, formatINRCompact } from '../lib/money';
import { useAppStore } from '../store/useAppStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const profile = useAppStore((state) => state.profile);
  const heldDocs = useAppStore((state) => state.heldDocs);
  const applications = useAppStore((state) => state.applications);
  const deadlines = useAppStore((state) => state.deadlines);

  const { matches, byId, summary, scholarships } = useMatches();

  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Student';

  // Calculate claimed percentage for the ProgressRing
  const claimedPercentage =
    summary.eligibleTotal > 0
      ? Math.round((summary.appliedTotal / summary.eligibleTotal) * 100)
      : 0;

  // Top 3 eligible scholarships sorted by amount desc
  const eligibleScholarships = matches
    .filter((m) => m.status === 'eligible')
    .map((m) => byId[m.scholarshipId].scholarship)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-ink-900 tracking-tight">
            Hi {firstName} 👋
          </h1>
          <p className="text-sm sm:text-base text-ink-500 mt-0.5">
            Here's your live funding picture across verified scholarship criteria.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/profile')}
            leftIcon={<GraduationCap className="w-3.5 h-3.5 text-brand-600" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Hero Row: 12-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Money Meter Hero (8 columns on desktop) */}
        <div className="lg:col-span-8 flex">
          <MoneyMeter
            eligibleTotal={summary.eligibleTotal}
            unlockableTotal={summary.unlockableTotal}
            appliedTotal={summary.appliedTotal}
            eligibleCount={summary.eligibleCount}
            almostCount={summary.almostCount}
          />
        </div>

        {/* Claimed Progress ProgressRing Card (4 columns on desktop) */}
        <div className="lg:col-span-4 flex">
          <Card className="p-6 sm:p-7 w-full flex flex-col justify-between border-line shadow-card bg-surface">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500 font-display">
                  Claimed Progress
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                  {summary.appliedTotal > 0 ? 'Active' : 'Not started'}
                </span>
              </div>
              <p className="text-xs text-ink-500 mt-1">
                Portion of eligible funds you have applied for or secured.
              </p>
            </div>

            <div className="my-6 flex items-center justify-center">
              <ProgressRing
                percentage={claimedPercentage}
                size={140}
                strokeWidth={10}
                tone="brand"
                label="Claimed"
                sublabel={`${formatINRCompact(summary.appliedTotal)} / ${formatINRCompact(summary.eligibleTotal)}`}
              />
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
              <span className="text-ink-500">Applications in progress:</span>
              <button
                type="button"
                onClick={() => navigate('/tracker')}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                {applications.length} tracked →
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* 4 Stat Tiles Row (2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <StatTile
          label="Potential to unlock"
          value={formatINR(summary.unlockableTotal)}
          sublabel={`${summary.almostCount} near-miss grants`}
          icon={<KeyRound className="w-5 h-5" />}
          to="/unlock"
          tone="unlock"
        />

        <StatTile
          label="Deadlines approaching"
          value={summary.deadlinesSoon}
          sublabel="Due within 14 days"
          icon={<CalendarClock className="w-5 h-5" />}
          to="/tracker"
          tone={summary.deadlinesSoon > 0 ? 'warning' : 'neutral'}
          isAlert={summary.deadlinesSoon > 0}
        />

        <StatTile
          label="Missing documents"
          value={summary.missingDocsCount}
          sublabel="Needed for eligible grants"
          icon={<FolderArchive className="w-5 h-5" />}
          to="/wallet"
          tone="neutral"
        />

        <StatTile
          label="Tracked applications"
          value={applications.length}
          sublabel="Saved or submitted"
          icon={<ListTodo className="w-5 h-5" />}
          to="/tracker"
          tone="brand"
        />
      </div>

      {/* Today's Action Card */}
      <div>
        <TodaysAction
          matches={matches}
          scholarships={scholarships}
          applications={applications}
          deadlines={deadlines}
          heldDocs={heldDocs}
          unlockableTotal={summary.unlockableTotal}
          almostCount={summary.almostCount}
        />
      </div>

      {/* Top Matches Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 tracking-tight">
              Top Eligible Scholarships
            </h2>
            <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
              Highest-value opportunities you qualify for immediately.
            </p>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/discover')}
          >
            View all ({summary.eligibleCount}) →
          </Button>
        </div>

        {eligibleScholarships.length === 0 ? (
          <EmptyState
            illustration="coins"
            title="No eligible scholarships yet"
            description="You don't have any directly matching scholarships with your current profile. Check our Unlock engine to see what you're missing!"
            action={
              <Button variant="unlock" onClick={() => navigate('/unlock')}>
                Check Unlock Opportunities
              </Button>
            }
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.04,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {eligibleScholarships.map((s) => {
              const match = byId[s.id]?.match;
              return (
                <motion.div
                  key={s.id}
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                  }}
                >
                  <Card
                    interactive
                    onClick={() => navigate(`/scholarship/${s.id}`)}
                    className="p-5 flex flex-col justify-between border-line hover:border-brand-500/50 h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">
                          {s.providerType}
                        </span>
                        <span className="text-[11px] text-ink-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-ink-500" />
                          {s.deadlineInDays}d left
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-ink-900 line-clamp-1 mb-1">
                        {s.name}
                      </h3>
                      <p className="text-xs text-ink-500 mb-3">{s.provider}</p>

                      <div className="font-money text-2xl font-bold text-forest-900 mb-3 tabular-nums">
                        {formatINR(s.amount)}
                        <span className="text-xs font-normal text-ink-500 font-sans ml-1">
                          / year
                        </span>
                      </div>

                      <p className="text-xs text-brand-700 bg-brand-50/70 p-2.5 rounded-xl border border-brand-100 line-clamp-2">
                        {match?.headline || 'You qualify for this grant'}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-line flex items-center justify-between">
                      <span className="text-xs text-ink-500">
                        {s.requiredDocs.length} documents required
                      </span>
                      <span className="text-xs font-semibold text-brand-600">
                        View details →
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
