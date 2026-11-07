import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info, KeyRound, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { UnlockCard, UnlockGroup } from '../components/money/UnlockCard';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { INCOME_OPTIONS } from '../data/options';
import { useMatches } from '../hooks/useMatches';
import { formatINR } from '../lib/money';
import { useAppStore } from '../store/useAppStore';
import { IncomeBracket } from '../types';

export default function Unlock() {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);
  const setProfile = useAppStore((state) => state.setProfile);
  const setDocHeld = useAppStore((state) => state.setDocHeld);

  const { matches, byId, summary } = useMatches();

  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal States
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [selectedIncomeBracket, setSelectedIncomeBracket] = useState<IncomeBracket>(
    profile?.incomeBracket === 'unknown' ? '2.5L-5L' : profile?.incomeBracket || '2.5L-5L',
  );

  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [newMarks, setNewMarks] = useState<number>(profile?.marksPercent || 68);

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
    if (group.actionType === 'income') {
      setSelectedIncomeBracket(
        profile?.incomeBracket === 'unknown'
          ? '2.5L-5L'
          : profile?.incomeBracket || '2.5L-5L',
      );
      setIsIncomeModalOpen(true);
    } else if (group.actionType === 'marks') {
      // Suggest lifting marks to 75 if currently below
      setNewMarks(profile?.marksPercent && profile.marksPercent < 75 ? 75 : profile?.marksPercent || 75);
      setIsMarksModalOpen(true);
    }
  };

  const handleSaveIncome = () => {
    if (!profile) return;

    setProfile({
      ...profile,
      incomeBracket: selectedIncomeBracket,
    });
    // Mark income certificate held in wallet as well
    setDocHeld('income-certificate', true);
    setIsIncomeModalOpen(false);

    setToast({
      id: String(Date.now()),
      tone: 'success',
      title: 'Income Certificate Verified 🎉',
      message: 'Your funding potential has been recalculated live!',
    });
  };

  const handleSaveMarks = () => {
    if (!profile) return;

    setProfile({
      ...profile,
      marksPercent: newMarks,
    });
    setIsMarksModalOpen(false);

    setToast({
      id: String(Date.now()),
      tone: 'success',
      title: `Marks Updated to ${newMarks}% 🎉`,
      message: 'New merit scholarships unlocked on your Dashboard!',
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

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
            <div className="p-2.5 rounded-xl bg-unlock-500 text-white shrink-0 mt-0.5 shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-ink-900">
                You have {summary.almostCount} near-miss scholarships
              </h2>
              <p className="text-xs sm:text-sm text-ink-700 mt-0.5 max-w-2xl">
                Updating your income certificate status or raising your percentage will instantly convert these into verified eligible funding on your dashboard.
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

      {/* Modal 1: Income Certificate Verification Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title="Verify Income Certificate"
        description="Select the annual family income bracket shown on your certified revenue document."
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsIncomeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="unlock"
              size="sm"
              onClick={handleSaveIncome}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Confirm & Unlock
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          {INCOME_OPTIONS.filter((opt) => opt.value !== 'unknown').map((opt) => {
            const isSelected = selectedIncomeBracket === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => setSelectedIncomeBracket(opt.value)}
                className={clsx(
                  'p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none',
                  isSelected
                    ? 'bg-unlock-50 border-unlock-500 shadow-xs'
                    : 'bg-surface border-line hover:border-ink-300 hover:bg-canvas/50',
                )}
              >
                <div
                  className={clsx(
                    'w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors',
                    isSelected
                      ? 'border-unlock-600 bg-unlock-600'
                      : 'border-ink-300 bg-surface',
                  )}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink-900 leading-snug">
                    {opt.label}
                  </h4>
                  <p className="text-xs text-ink-500 mt-0.5">{opt.helper}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Modal 2: Update Marks Modal */}
      <Modal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
        title="Update Academic Marks"
        description="Raise your marks to simulate higher semester performance and unlock merit grants."
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsMarksModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="unlock"
              size="sm"
              onClick={handleSaveMarks}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Update & Recalculate
            </Button>
          </div>
        }
      >
        <div className="space-y-6 py-2">
          <div className="p-4 bg-canvas/60 rounded-2xl border border-line flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-ink-500">
                New Exam Percentage
              </span>
              <div className="font-money text-4xl font-bold text-forest-900 tabular-nums">
                {newMarks}%
              </div>
            </div>

            <div className="w-28">
              <Input
                type="number"
                min={0}
                max={100}
                value={newMarks}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val) && val >= 0 && val <= 100) {
                    setNewMarks(val);
                  }
                }}
                className="text-center font-bold text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={newMarks}
              onChange={(e) => setNewMarks(Number(e.target.value))}
              className="w-full h-2 bg-ink-100 rounded-lg appearance-none cursor-pointer accent-unlock-500"
            />
            <div className="flex justify-between text-xs text-ink-500 px-1 font-mono">
              <span>60%</span>
              <span className="font-bold text-brand-700">68% (Priya)</span>
              <span className="font-bold text-unlock-600">75% (Merit Target)</span>
              <span>85%</span>
            </div>
          </div>

          <div className="p-3 bg-unlock-50 border border-unlock-200 rounded-xl text-xs text-ink-700">
            💡 <strong>Demo tip:</strong> Setting marks to <strong>75%</strong> will unlock the Reliance Foundation Undergraduate Merit Award (₹80,000) and K. C. Mahindra Fellowship (₹65,000) live!
          </div>
        </div>
      </Modal>
    </div>
  );
}
