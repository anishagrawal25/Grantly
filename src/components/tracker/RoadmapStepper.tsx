import React from 'react';
import { Check, Compass, FileCheck, CheckCircle2, Trophy, Clock } from 'lucide-react';
import clsx from 'clsx';
import { Application } from '../../types';

export interface RoadmapStepperProps {
  applications: Application[];
  className?: string;
}

const ROADMAP_STEPS = [
  { id: 1, label: 'Discover', icon: Compass, desc: 'Find matches' },
  { id: 2, label: 'Check Eligibility', icon: FileCheck, desc: 'Review rules' },
  { id: 3, label: 'Prepare', icon: Clock, desc: 'Gather documents' },
  { id: 4, label: 'Apply', icon: CheckCircle2, desc: 'Portal submit' },
  { id: 5, label: 'Outcome', icon: Trophy, desc: 'Award decision' },
];

export const RoadmapStepper: React.FC<RoadmapStepperProps> = ({
  applications,
  className,
}) => {
  // Determine furthest stage reached
  let currentStageIndex = 1;
  if (applications.some((a) => a.stage === 'awarded' || a.stage === 'rejected')) {
    currentStageIndex = 5;
  } else if (applications.some((a) => a.stage === 'applied')) {
    currentStageIndex = 4;
  } else if (applications.some((a) => a.stage === 'preparing')) {
    currentStageIndex = 3;
  } else if (applications.some((a) => a.stage === 'saved')) {
    currentStageIndex = 2;
  }

  // Count per stage
  const countsByStage = {
    1: 30, // all available in catalog
    2: applications.filter((a) => a.stage === 'saved').length,
    3: applications.filter((a) => a.stage === 'preparing').length,
    4: applications.filter((a) => a.stage === 'applied').length,
    5: applications.filter((a) => a.stage === 'awarded' || a.stage === 'rejected').length,
  };

  return (
    <div className={clsx('w-full bg-surface p-5 sm:p-6 rounded-2xl border border-line shadow-card', className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-wider font-display">
          Scholarship Journey Roadmap
        </span>
        <span className="text-xs font-medium text-ink-500">
          Step {currentStageIndex} of 5 reached
        </span>
      </div>

      {/* Progress track */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-1 bg-ink-100 z-0 hidden sm:block">
          <div
            className="h-full bg-brand-500 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStageIndex - 1) / (ROADMAP_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {ROADMAP_STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStageIndex;
          const isCurrent = step.id === currentStageIndex;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center text-center flex-1"
            >
              <div
                className={clsx(
                  'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all select-none',
                  isCompleted
                    ? 'bg-brand-600 text-white shadow-xs'
                    : isCurrent
                      ? 'bg-forest-900 text-white ring-4 ring-brand-100 shadow-xs'
                      : 'bg-ink-100 text-ink-500 border border-line',
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <span
                className={clsx(
                  'text-xs font-bold mt-2 leading-tight',
                  isCurrent ? 'text-forest-900' : 'text-ink-700',
                )}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-ink-500 hidden md:inline mt-0.5">
                {step.desc}
              </span>
              <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded mt-1">
                {countsByStage[step.id as keyof typeof countsByStage]} active
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
