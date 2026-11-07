import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Stepper } from '../components/ui/Stepper';
import {
  CATEGORY_OPTIONS,
  COURSE_OPTIONS,
  GENDER_OPTIONS,
  INDIAN_STATES,
  LEVEL_OPTIONS,
} from '../data/options';
import { useAppStore } from '../store/useAppStore';
import { Category, Course, Gender, Level, Profile } from '../types';

const STEP_LABELS = [
  'About You',
  'Study',
  'Category',
  'Academic',
  'Income',
  'Review',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const existingProfile = useAppStore((state) => state.profile);

  const [step, setStep] = useState<number>(1);

  // Form state initialized from existing profile or empty
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: existingProfile?.name || '',
    gender: existingProfile?.gender || 'Female',
    state: existingProfile?.state || 'Maharashtra',
    course: existingProfile?.course || 'Engineering',
    level: existingProfile?.level || 'Undergraduate',
    year: existingProfile?.year || 2,
    category: existingProfile?.category || 'OBC',
    marksPercent: existingProfile?.marksPercent || 68,
    incomeBracket: existingProfile?.incomeBracket || '2.5L-5L',
    hasDisability: existingProfile?.hasDisability || false,
    firstGenerationLearner: existingProfile?.firstGenerationLearner || true,
  });

  const [nameError, setNameError] = useState<string>('');

  // Step 1 Validation
  const isStep1Valid = Boolean(formData.name && formData.name.trim().length >= 2);
  // Step 2 Validation
  const isStep2Valid = Boolean(
    formData.state && formData.course && formData.level && formData.year,
  );
  // Step 3 Validation
  const isStep3Valid = Boolean(formData.category);

  const handleNext = () => {
    if (step === 1 && !isStep1Valid) {
      setNameError('Please enter your full name (at least 2 characters)');
      return;
    }
    setNameError('');
    if (step < 6) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10">
      {/* Top Stepper */}
      <div className="mb-8">
        <Stepper
          currentStep={step}
          totalSteps={6}
          steps={STEP_LABELS}
          className="mb-6"
        />
      </div>

      {/* Main Card Container */}
      <Card className="p-6 sm:p-8 bg-surface shadow-card border-line">
        {/* STEP 1: About you */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                Step 1 of 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-1">
                Tell us about yourself
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                We use this to identify scholarships matching your personal background.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Your Full Name"
                placeholder="e.g. Priya Deshmukh"
                value={formData.name || ''}
                error={nameError}
                onChange={(e) => {
                  setNameError('');
                  setFormData({ ...formData, name: e.target.value });
                }}
                autoFocus
              />

              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {GENDER_OPTIONS.map((g) => {
                    const isSelected = formData.gender === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, gender: g.value as Gender })
                        }
                        className={clsx(
                          'min-h-[44px] py-2.5 px-3 rounded-xl border text-sm font-medium transition-all select-none',
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-700 font-semibold shadow-xs'
                            : 'bg-surface border-line text-ink-700 hover:border-ink-300',
                        )}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Where you study */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                Step 2 of 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-1">
                Where do you study?
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Many central and state scholarships are mapped directly to your state and study field.
              </p>
            </div>

            <div className="space-y-5">
              {/* State Select */}
              <Select
                label="Home State / Domicile"
                value={formData.state || ''}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
              />

              {/* Course Discipline */}
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  Field of Study
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COURSE_OPTIONS.map((c) => {
                    const isSelected = formData.course === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, course: c.value as Course })
                        }
                        className={clsx(
                          'min-h-[44px] py-2 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left truncate',
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-700 font-semibold shadow-xs'
                            : 'bg-surface border-line text-ink-700 hover:border-ink-300',
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Level of Study */}
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  Study Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LEVEL_OPTIONS.map((l) => {
                    const isSelected = formData.level === l.value;
                    return (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, level: l.value as Level })
                        }
                        className={clsx(
                          'min-h-[44px] py-2 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left truncate',
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-700 font-semibold shadow-xs'
                            : 'bg-surface border-line text-ink-700 hover:border-ink-300',
                        )}
                      >
                        {l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Year of study */}
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  Current Year of Course
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((yr) => {
                    const isSelected = formData.year === yr;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setFormData({ ...formData, year: yr })}
                        className={clsx(
                          'flex-1 min-h-[44px] py-2 rounded-xl border text-sm font-medium transition-all',
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold shadow-xs'
                            : 'bg-surface border-line text-ink-700 hover:border-ink-300',
                        )}
                      >
                        Year {yr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Category */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                Step 3 of 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-1">
                Your social category
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Government and foundation grants often have reserved allocations. Pick your certificate category.
              </p>
            </div>

            <div className="space-y-2.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = formData.category === cat.value;
                return (
                  <div
                    key={cat.value}
                    onClick={() =>
                      setFormData({ ...formData, category: cat.value as Category })
                    }
                    className={clsx(
                      'p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 select-none',
                      isSelected
                        ? 'bg-brand-50/70 border-brand-500 shadow-xs'
                        : 'bg-surface border-line hover:border-ink-300 hover:bg-canvas/50',
                    )}
                  >
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? 'border-brand-600 bg-brand-600'
                          : 'border-ink-300 bg-surface',
                      )}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={clsx(
                          'text-sm font-semibold leading-tight',
                          isSelected ? 'text-brand-900' : 'text-ink-900',
                        )}
                      >
                        {cat.label}
                      </h4>
                      <p className="text-xs text-ink-500 mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Temporary placeholder for steps 4-6 until Commit 21 */}
        {step > 3 && (
          <div className="py-8 text-center space-y-3">
            <h3 className="text-lg font-bold text-ink-900">
              Steps 4–6 in progress
            </h3>
            <p className="text-sm text-ink-500">
              Completing in the next build commit.
            </p>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-line">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {step === 1 ? 'Back to Home' : 'Back'}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            disabled={
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid) ||
              (step === 3 && !isStep3Valid)
            }
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {step === 6 ? 'View Matches' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
