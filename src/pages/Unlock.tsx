import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, KeyRound, Sparkles } from 'lucide-react';
import { UnlockCard, UnlockGroup } from '../components/money/UnlockCard';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useMatches } from '../hooks/useMatches';
import { formatINR } from '../lib/money';

export default function Unlock() {
  const navigate = useNavigate();
  const { matches, byId, summary } = useMatches();

  // Group almost matches by unlock step
  const unlockGroups = useMemo<UnlockGroup[]>(() => {
    const almostMatches = matches.filter((m) => m.status === 'almost');
    const groupMap = new Map<string, UnlockGroup>();

    for (const match of almostMatches) {
      const scholarship = byId[match.scholarshipId]?.scholarship;
      if (!scholarship) continue;

      const nextStep =
        match.unlockStep || 'Complete remaining qualification step';

      let actionType: 'income' | 'marks' | 'other' = 'other';
      if (nextStep.toLowerCase().includes('income certificate')) {
        actionType = 'income';
      } else if (nextStep.toLowerCase().includes('marks')) {
        actionType = 'marks';
      }

      if (groupMap.has(nextStep)) {
        const existing = groupMap.get(nextStep)!;
        existing.totalAmount += scholarship.amount;
        existing.scholarships.push(scholarship);
      } else {
        groupMap.set(nextStep, {
          actionType,
          nextStep,
          totalAmount: scholarship.amount,
          scholarships: [scholarship],
        });
      }
    }

    return Array.from(groupMap.values()).sort(
      (a, b) => b.totalAmount - a.totalAmount,
    );
  }, [matches, byId]);

  const handleActionClick = (group: UnlockGroup) => {
    // Will be wired to interactive modals in Commit 32
    console.log('Unlock action clicked:', group);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Unlock More Funding"
        subtitle="These scholarships are just 1 step away. Complete a requirement to add them to your eligible total."
        badge={
          summary.unlockableTotal > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-unlock-500 text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{formatINR(summary.unlockableTotal)} within reach</span>
            </span>
          ) : undefined
        }
      />

      {/* Hero Banner */}
      {summary.unlockableTotal > 0 && (
        <div className="p-5 sm:p-6 bg-unlock-50/70 border border-unlock-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-unlock-500 text-white shrink-0 mt-0.5">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-ink-900">
                You have {summary.almostCount} near-miss scholarships
              </h2>
              <p className="text-xs sm:text-sm text-ink-700 mt-0.5 max-w-2xl">
                Small adjustments like uploading an income certificate or lifting your marks will instantly convert these into verified eligible funding.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Groups Grid */}
      {unlockGroups.length === 0 ? (
        <div className="py-12 flex justify-center">
          <EmptyState
            illustration="coins"
            title="Nothing to unlock right now"
            description="You're all caught up! You've unlocked all eligible scholarships matching your current profile."
            action={
              <Button variant="primary" onClick={() => navigate('/discover')}>
                Explore All Scholarships
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unlockGroups.map((group, idx) => (
            <UnlockCard
              key={idx}
              group={group}
              onActionClick={handleActionClick}
            />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-ink-500 pt-4">
        <Info className="w-4 h-4 text-ink-500" />
        <span>
          Subject to official verification on the provider's portal.
        </span>
      </div>
    </div>
  );
}
