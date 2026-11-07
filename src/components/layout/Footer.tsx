import React from 'react';
import { Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 border-t border-line/60 text-center">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-500">
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <Info className="w-4 h-4 text-ink-500 shrink-0" />
          <span>
            Demo data. Eligibility is indicative and subject to official verification on the provider's portal.
          </span>
        </div>
        <div className="flex items-center gap-4 text-ink-500">
          <span>Grantly © 2026</span>
          <span>•</span>
          <span>No login required</span>
        </div>
      </div>
    </footer>
  );
};
