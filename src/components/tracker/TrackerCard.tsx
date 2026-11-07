import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, FileText, CheckCircle } from 'lucide-react';
import { Application, ApplicationStage, DocumentId, Scholarship } from '../../types';
import { formatINR } from '../../lib/money';
import { getDaysRemaining } from '../../lib/dates';
import { DeadlinePill } from './DeadlinePill';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface TrackerCardProps {
  application: Application;
  scholarship: Scholarship;
  heldDocs: DocumentId[];
  deadlineIso?: string;
  onStageChange: (stage: ApplicationStage) => void;
  onRemove: () => void;
}

const STAGE_OPTIONS: { value: ApplicationStage; label: string }[] = [
  { value: 'saved', label: 'Saved' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'applied', label: 'Applied' },
  { value: 'awarded', label: 'Awarded 🎉' },
  { value: 'rejected', label: 'Not Selected' },
];

export const TrackerCard: React.FC<TrackerCardProps> = ({
  application,
  scholarship,
  heldDocs,
  deadlineIso,
  onStageChange,
  onRemove,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const daysRemaining = deadlineIso ? getDaysRemaining(deadlineIso) : scholarship.deadlineInDays;
  const totalRequired = scholarship.requiredDocs.length;
  const heldCount = scholarship.requiredDocs.filter((id) => heldDocs.includes(id)).length;
  const docPercent = totalRequired > 0 ? Math.round((heldCount / totalRequired) * 100) : 100;
  const allDocsReady = heldCount === totalRequired;

  return (
    <>
      <div className="bg-surface rounded-xl border border-line shadow-card p-4 flex flex-col gap-3 hover:border-brand-300 transition-all">
        {/* Header: Title and Amount */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-ink-500 uppercase tracking-wide truncate block">
              {scholarship.provider}
            </span>
            <Link
              to={`/scholarship/${scholarship.id}`}
              className="text-sm font-bold text-forest-900 hover:text-brand-700 transition-colors line-clamp-2 leading-snug group flex items-baseline gap-1"
            >
              <span>{scholarship.name}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-bold text-forest-900 font-display">
              {formatINR(scholarship.amount)}
            </span>
            <span className="text-[10px] text-ink-500 block">/year</span>
          </div>
        </div>

        {/* Deadline and Urgency */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-line/60">
          <DeadlinePill daysRemaining={daysRemaining} />
          <span className="text-[11px] text-ink-500 font-medium">
            {scholarship.providerType}
          </span>
        </div>

        {/* Document Readiness Progress Bar */}
        <div className="bg-canvas/80 p-2.5 rounded-lg border border-line/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-ink-600 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-ink-400" />
              Documents ready
            </span>
            <span className="font-semibold text-ink-800">
              {heldCount} / {totalRequired}
            </span>
          </div>
          <div className="w-full bg-ink-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                allDocsReady ? 'bg-forest-600' : 'bg-unlock-500'
              }`}
              style={{ width: `${docPercent}%` }}
            />
          </div>
          {allDocsReady && (
            <p className="text-[10px] text-forest-800 font-medium mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-forest-600" /> All required documents are in your wallet
            </p>
          )}
        </div>

        {/* Footer: Stage selector and Delete */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <label htmlFor={`stage-select-${scholarship.id}`} className="text-[11px] text-ink-500 font-medium shrink-0">
              Stage:
            </label>
            <select
              id={`stage-select-${scholarship.id}`}
              value={application.stage}
              onChange={(e) => onStageChange(e.target.value as ApplicationStage)}
              className="text-xs font-medium text-ink-800 bg-surface border border-line rounded-lg py-1 px-2 focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer w-full"
            >
              {STAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Remove application"
            className="p-1.5 text-ink-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Application"
        description="Are you sure you want to remove this scholarship from your tracking roadmap?"
        maxWidth="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setShowDeleteModal(false);
                onRemove();
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-700">
          This will remove <strong className="text-ink-900 font-semibold">{scholarship.name}</strong> from your
          tracker. You can add it back anytime from Discover.
        </p>
      </Modal>
    </>
  );
};
