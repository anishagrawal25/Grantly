import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface StepItem {
  number: number;
  label: string;
}

export interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  steps,
  className,
}) => {
  const progressPercentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className={clsx('w-full', className)}>
      {/* Top progress bar */}
      <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-brand-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.max(progressPercentage, 8)}%` }}
        />
      </div>

      {/* Step dots with numbers or labels */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 select-none',
                  isCompleted
                    ? 'bg-brand-600 text-white'
                    : isCurrent
                      ? 'bg-forest-900 text-white ring-4 ring-brand-100'
                      : 'bg-ink-100 text-ink-500',
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
              {steps && steps[step - 1] && (
                <span
                  className={clsx(
                    'text-[10px] mt-1 font-medium hidden sm:inline max-w-[70px] text-center truncate',
                    isCurrent ? 'text-forest-900 font-bold' : 'text-ink-500',
                  )}
                >
                  {steps[step - 1]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
