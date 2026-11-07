import React from 'react';
import { CheckCircle2, FileText, Plus } from 'lucide-react';
import clsx from 'clsx';
import { MASTER_DOCUMENTS } from '../../data/documents';
import { useAppStore } from '../../store/useAppStore';
import { DocumentId } from '../../types';

export interface DocChecklistProps {
  requiredDocs: DocumentId[];
  className?: string;
  onIncomeDocClick?: () => void;
}

export const DocChecklist: React.FC<DocChecklistProps> = ({
  requiredDocs,
  className,
  onIncomeDocClick,
}) => {
  const heldDocs = useAppStore((state) => state.heldDocs);
  const toggleDoc = useAppStore((state) => state.toggleDoc);
  const profile = useAppStore((state) => state.profile);

  const docMap = new Map(MASTER_DOCUMENTS.map((d) => [d.id, d]));

  const readyCount = requiredDocs.filter((id) => heldDocs.includes(id)).length;
  const progressPct =
    requiredDocs.length > 0
      ? Math.round((readyCount / requiredDocs.length) * 100)
      : 100;

  const handleDocClick = (docId: DocumentId) => {
    // If user clicks income certificate and income bracket is unknown, trigger income modal
    if (
      docId === 'income-certificate' &&
      profile?.incomeBracket === 'unknown' &&
      !heldDocs.includes('income-certificate') &&
      onIncomeDocClick
    ) {
      onIncomeDocClick();
      return;
    }
    toggleDoc(docId);
  };

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Progress Header */}
      <div className="p-4 bg-canvas/60 rounded-2xl border border-line">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-ink-900 mb-2">
          <span>Application Readiness</span>
          <span className="font-bold text-brand-700">
            {readyCount} of {requiredDocs.length} documents ready ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-2 bg-ink-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Document Items List */}
      <div className="space-y-2.5">
        {requiredDocs.map((docId) => {
          const doc = docMap.get(docId);
          if (!doc) return null;

          const isHeld = heldDocs.includes(docId);

          return (
            <div
              key={docId}
              onClick={() => handleDocClick(docId)}
              className={clsx(
                'p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3',
                isHeld
                  ? 'bg-brand-50/50 border-brand-200/80 hover:bg-brand-50'
                  : 'bg-surface border-line hover:border-ink-300 hover:bg-canvas/50',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    'p-2 rounded-lg shrink-0 mt-0.5',
                    isHeld
                      ? 'bg-brand-600 text-white'
                      : 'bg-ink-100 text-ink-500',
                  )}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink-900 leading-snug">
                    {doc.label}
                  </h4>
                  <p className="text-xs text-ink-500 mt-0.5">{doc.hint}</p>
                </div>
              </div>

              <div className="shrink-0 self-center">
                {isHeld ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-ink-100 text-ink-700 border border-line">
                    <Plus className="w-3 h-3 text-ink-500" />
                    <span>Mark held</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-ink-500 text-center">
        Click any document row to toggle whether you have it. Checklists across all scholarships update immediately.
      </p>
    </div>
  );
};
