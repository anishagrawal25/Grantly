import React from 'react';
import {
  Award,
  Check,
  CreditCard,
  FileBadge,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Home,
  Image,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import clsx from 'clsx';
import { Card } from '../ui/Card';
import { DocumentId } from '../../types';

export interface DocumentTileProps {
  id: DocumentId;
  label: string;
  hint: string;
  isHeld: boolean;
  neededCount: number;
  onToggle: (id: DocumentId) => void;
}

export const DocumentTile: React.FC<DocumentTileProps> = ({
  id,
  label,
  hint,
  isHeld,
  neededCount,
  onToggle,
}) => {
  // Document specific icons
  const getDocIcon = (docId: DocumentId) => {
    switch (docId) {
      case 'aadhaar':
        return <CreditCard className="w-5 h-5" />;
      case 'income-certificate':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'caste-certificate':
        return <Award className="w-5 h-5" />;
      case 'marksheet':
        return <FileCheck2 className="w-5 h-5" />;
      case 'bank-passbook':
        return <FileBadge className="w-5 h-5" />;
      case 'admission-proof':
        return <FileText className="w-5 h-5" />;
      case 'domicile-certificate':
        return <Home className="w-5 h-5" />;
      case 'disability-certificate':
        return <ShieldAlert className="w-5 h-5" />;
      case 'passport-photo':
        return <Image className="w-5 h-5" />;
      case 'bonafide-certificate':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <Card
      className={clsx(
        'p-4 sm:p-5 flex flex-col justify-between transition-all select-none border-line',
        isHeld
          ? 'bg-brand-50/40 border-brand-200/80'
          : 'bg-surface hover:border-ink-300',
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className={clsx(
              'p-2.5 rounded-xl shrink-0',
              isHeld
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-ink-100 text-ink-700',
            )}
          >
            {getDocIcon(id)}
          </div>

          {neededCount > 0 && (
            <span
              className={clsx(
                'text-[11px] font-semibold px-2 py-0.5 rounded-md text-right',
                isHeld
                  ? 'bg-brand-50 text-brand-700 border border-brand-100'
                  : 'bg-unlock-50 text-unlock-600 border border-unlock-100',
              )}
            >
              Needed by {neededCount} {neededCount === 1 ? 'grant' : 'grants'}
            </span>
          )}
        </div>

        <h4 className="text-sm sm:text-base font-bold text-ink-900 leading-snug">
          {label}
        </h4>
        <p className="text-xs text-ink-500 mt-1 line-clamp-2">{hint}</p>
      </div>

      <div className="pt-4 mt-4 border-t border-line/80 flex items-center justify-between">
        <span
          className={clsx(
            'text-xs font-semibold',
            isHeld ? 'text-brand-700' : 'text-ink-500',
          )}
        >
          {isHeld ? 'In your wallet' : 'Missing'}
        </span>

        <button
          type="button"
          onClick={() => onToggle(id)}
          className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[34px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            isHeld
              ? 'bg-brand-600 text-white shadow-xs hover:bg-brand-700'
              : 'bg-surface border border-line text-ink-700 hover:border-ink-300 hover:bg-canvas',
          )}
        >
          {isHeld ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Have it</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Need it</span>
            </>
          )}
        </button>
      </div>
    </Card>
  );
};

