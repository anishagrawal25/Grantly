import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Check, FileCheck, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { DocumentTile } from '../components/wallet/DocumentTile';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { MASTER_DOCUMENTS } from '../data/documents';
import { INCOME_OPTIONS } from '../data/options';
import { useMatches } from '../hooks/useMatches';
import { useAppStore } from '../store/useAppStore';
import { DocumentId, IncomeBracket } from '../types';

export default function Wallet() {
  const shouldReduceMotion = useReducedMotion();
  const profile = useAppStore((state) => state.profile);
  const setProfile = useAppStore((state) => state.setProfile);
  const heldDocs = useAppStore((state) => state.heldDocs);
  const toggleDoc = useAppStore((state) => state.toggleDoc);
  const setDocHeld = useAppStore((state) => state.setDocHeld);

  const { matches, byId } = useMatches();

  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Income Verification Modal State
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [selectedIncomeBracket, setSelectedIncomeBracket] =
    useState<IncomeBracket>('2.5L-5L');

  // Compute how many eligible scholarships require each document
  const neededDocCounts = useMemo(() => {
    const counts: Record<DocumentId, number> = {
      aadhaar: 0,
      'income-certificate': 0,
      'caste-certificate': 0,
      marksheet: 0,
      'bank-passbook': 0,
      'admission-proof': 0,
      'domicile-certificate': 0,
      'disability-certificate': 0,
      'passport-photo': 0,
      'bonafide-certificate': 0,
    };

    for (const match of matches) {
      if (match.status === 'eligible') {
        const s = byId[match.scholarshipId]?.scholarship;
        if (s) {
          for (const doc of s.requiredDocs) {
            counts[doc] = (counts[doc] || 0) + 1;
          }
        }
      }
    }

    return counts;
  }, [matches, byId]);

  // "Most needed next": missing documents sorted by neededCount descending
  const mostNeededNext = useMemo(() => {
    return MASTER_DOCUMENTS.filter(
      (doc) => !heldDocs.includes(doc.id) && neededDocCounts[doc.id] > 0,
    ).sort((a, b) => neededDocCounts[b.id] - neededDocCounts[a.id]);
  }, [heldDocs, neededDocCounts]);

  const handleToggle = (docId: DocumentId) => {
    // SPECIAL REQUIREMENT (Section 10.7):
    // When profile.incomeBracket === 'unknown' and user toggles Income Certificate to "Have it",
    // open the income certificate modal to pick their real income bracket!
    if (
      docId === 'income-certificate' &&
      profile?.incomeBracket === 'unknown' &&
      !heldDocs.includes('income-certificate')
    ) {
      setIsIncomeModalOpen(true);
      return;
    }

    toggleDoc(docId);
    const willBeHeld = !heldDocs.includes(docId);
    setToast({
      id: String(Date.now()),
      tone: willBeHeld ? 'success' : 'info',
      title: willBeHeld ? 'Document Added' : 'Document Removed',
      message: `${MASTER_DOCUMENTS.find((d) => d.id === docId)?.label} checklist updated.`,
    });
  };

  const handleConfirmIncomeModal = () => {
    if (!profile) return;

    setProfile({
      ...profile,
      incomeBracket: selectedIncomeBracket,
    });
    setDocHeld('income-certificate', true);
    setIsIncomeModalOpen(false);

    setToast({
      id: String(Date.now()),
      tone: 'success',
      title: 'Income Certificate Verified 🎉',
      message:
        'Your Money Meter and eligibility statuses have recalculated live!',
    });
  };

  const totalDocs = MASTER_DOCUMENTS.length;
  const heldCount = heldDocs.length;
  const progressPercent = Math.round((heldCount / totalDocs) * 100);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <PageHeader
        title="Document Wallet"
        subtitle="Tick what you already have. Every checklist and eligibility calculation updates automatically."
      />

      {/* Wallet Progress Card */}
      <Card className="p-6 sm:p-7 bg-surface border-line shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-forest-900 text-brand-500 shadow-xs">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-ink-900">
                Wallet Readiness: {heldCount} of {totalDocs} documents ready
              </h2>
              <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
                Having core certificates ready accelerates application review.
              </p>
            </div>
          </div>

          <div className="font-money text-3xl font-bold text-forest-900 tabular-nums self-end sm:self-auto">
            {progressPercent}%
          </div>
        </div>

        <div className="w-full h-3 bg-ink-100 rounded-full overflow-hidden p-0.5 border border-line">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>
      </Card>

      {/* Section: Most Needed Next */}
      {mostNeededNext.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-unlock-600" />
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider font-display">
              Most Needed Next
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mostNeededNext.slice(0, 3).map((doc) => (
              <DocumentTile
                key={doc.id}
                id={doc.id}
                label={doc.label}
                hint={doc.hint}
                isHeld={false}
                neededCount={neededDocCounts[doc.id]}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Master 10 Documents Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider font-display">
          All Application Documents ({totalDocs})
        </h3>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.03,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {MASTER_DOCUMENTS.map((doc) => (
            <motion.div
              key={doc.id}
              variants={{
                hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
              }}
            >
              <DocumentTile
                id={doc.id}
                label={doc.label}
                hint={doc.hint}
                isHeld={heldDocs.includes(doc.id)}
                neededCount={neededDocCounts[doc.id] || 0}
                onToggle={handleToggle}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-canvas/70 border border-line rounded-2xl flex items-center justify-center gap-2 text-xs text-ink-500 text-center">
        <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
        <span>
          We don't upload or store your personal files on any server. This is an offline device checklist only.
        </span>
      </div>

      {/* Income Certificate Modal (when profile.incomeBracket is 'unknown') */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title="Which income bracket does your certificate show?"
        description="Select the verified annual family revenue shown on your government certificate."
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
              variant="primary"
              size="sm"
              onClick={handleConfirmIncomeModal}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Save & Recalculate
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
                    ? 'bg-brand-50 border-brand-500 shadow-xs'
                    : 'bg-surface border-line hover:border-ink-300 hover:bg-canvas/50',
                )}
              >
                <div
                  className={clsx(
                    'w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors',
                    isSelected
                      ? 'border-brand-600 bg-brand-600'
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
    </div>
  );
}
