import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';
import { formatINR, formatNumberIndian } from '../../lib/money';

export interface MoneyMeterProps {
  eligibleTotal: number;
  unlockableTotal: number;
  appliedTotal: number;
  eligibleCount: number;
  almostCount: number;
}

export const MoneyMeter: React.FC<MoneyMeterProps> = ({
  eligibleTotal,
  unlockableTotal,
  appliedTotal,
  eligibleCount,
  almostCount,
}) => {
  const { value, isUpdating } = useCountUp(eligibleTotal);

  // Compute percentages for the 3-segment bar
  const totalFunding = Math.max(eligibleTotal + unlockableTotal, 1);
  const eligiblePct = Math.max(
    Math.round((eligibleTotal / totalFunding) * 100),
    eligibleTotal > 0 ? 5 : 0,
  );
  const unlockablePct = Math.max(
    Math.round((unlockableTotal / totalFunding) * 100),
    unlockableTotal > 0 ? 5 : 0,
  );

  return (
    <motion.div
      animate={{ scale: isUpdating ? [1, 1.015, 1] : 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full rounded-3xl bg-forest-900 border border-forest-800 text-white p-6 sm:p-8 lg:p-9 shadow-pop overflow-hidden bg-noise"
    >
      {/* Soft Radial Glow */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-forest-600/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Large Faded ₹ glyph in background */}
      <div className="absolute right-4 -bottom-10 font-money text-[220px] sm:text-[260px] font-bold text-white/[0.06] select-none pointer-events-none leading-none z-0">
        ₹
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-100/90 font-display">
              Your Scholarship Potential
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-medium text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-unlock-500" />
            <span>Real-time match engine</span>
          </div>
        </div>

        {/* Hero Number Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="font-money text-4xl sm:text-6xl lg:text-7xl font-bold text-white/90 select-none">
              ₹
            </span>
            <span className="font-money text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white tabular-nums leading-none">
              {formatNumberIndian(value)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-xs sm:text-sm text-ink-100/90">
            <span>
              across{' '}
              <strong className="text-white font-semibold">
                {eligibleCount} {eligibleCount === 1 ? 'scholarship' : 'scholarships'}
              </strong>{' '}
              you qualify for right now
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-[11px] text-white/60">
              Illustrative · based on demo data
            </span>
          </div>
        </div>

        {/* Meter Tick Scale & Segment Bar */}
        <div className="mt-4 sm:mt-6 mb-6">
          {/* Subtle tick scale */}
          <div className="flex justify-between text-[9px] text-white/25 px-1 mb-1 font-mono select-none">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>

          {/* 3-segment horizontal progress bar */}
          <div className="h-3 sm:h-3.5 w-full bg-white/10 rounded-full p-0.5 flex gap-1 overflow-hidden backdrop-blur-xs">
            {/* 1. Eligible (Green) */}
            <motion.div
              initial={false}
              animate={{ width: `${eligiblePct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-brand-500 rounded-full shrink-0"
              title={`Eligible: ${formatINR(eligibleTotal)}`}
            />

            {/* 2. Unlockable (Saffron) */}
            <motion.div
              initial={false}
              animate={{ width: `${unlockablePct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-unlock-500 rounded-full shrink-0"
              title={`Unlockable: ${formatINR(unlockableTotal)}`}
            />

            {/* 3. Balance filler */}
            <div className="h-full bg-transparent flex-1" />
          </div>
        </div>

        {/* Legend Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-white/15">
          {/* Segment 1: Eligible */}
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shrink-0 mt-1" />
            <div>
              <span className="text-xs text-brand-100 font-medium">
                Ready to Claim
              </span>
              <p className="font-money text-base sm:text-lg font-bold text-white tabular-nums">
                {formatINR(eligibleTotal)}
              </p>
              <span className="text-[10px] text-white/60">
                {eligibleCount} scholarships
              </span>
            </div>
          </div>

          {/* Segment 2: Unlockable */}
          <Link
            to="/unlock"
            className="flex items-start gap-2.5 group hover:bg-white/5 p-1 rounded-xl transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-unlock-500 shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-unlock-100 font-medium">
                  Potential to Unlock
                </span>
                <ArrowUpRight className="w-3 h-3 text-unlock-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-money text-base sm:text-lg font-bold text-white tabular-nums">
                {formatINR(unlockableTotal)}
              </p>
              <span className="text-[10px] text-white/60">
                +{almostCount} with 1 requirement
              </span>
            </div>
          </Link>

          {/* Segment 3: Applied */}
          <Link
            to="/tracker"
            className="flex items-start gap-2.5 group hover:bg-white/5 p-1 rounded-xl transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/80 border border-white/40 shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-white/80 font-medium">
                  Claimed / In Review
                </span>
                <ArrowUpRight className="w-3 h-3 text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-money text-base sm:text-lg font-bold text-white tabular-nums">
                {formatINR(appliedTotal)}
              </p>
              <span className="text-[10px] text-white/60">
                Active in your tracker
              </span>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

