import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

export type ToastTone = 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  tone?: ToastTone;
  title: string;
  message?: string;
}

export interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-pop border bg-surface text-ink-900',
              toast.tone === 'success' && 'border-brand-500/30',
              toast.tone === 'warning' && 'border-unlock-500/30',
              toast.tone === 'info' && 'border-info-500/30',
            )}
          >
            {toast.tone === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            )}
            {toast.tone === 'warning' && (
              <AlertTriangle className="w-5 h-5 text-unlock-600 shrink-0 mt-0.5" />
            )}
            {(!toast.tone || toast.tone === 'info') && (
              <Info className="w-5 h-5 text-info-500 shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-ink-500 mt-0.5">{toast.message}</p>
              )}
            </div>

            <button
              onClick={onDismiss}
              aria-label="Dismiss toast"
              className="text-ink-300 hover:text-ink-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

