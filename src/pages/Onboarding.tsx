import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Users,
  Accessibility,
} from 'lucide-react';
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
  INCOME_OPTIONS,
  INDIAN_STATES,
  LEVEL_OPTIONS,
} from '../data/options';
import { useAppStore } from '../store/useAppStore';
import {
  Category,
  Course,
  Gender,
  IncomeBracket,
  Level,
  Profile,
} from '../types';

const STEP_LABELS = [
  'About You',
  'Study',
  'Category',
  'Academic',
  'Income',
  'Special Status',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const existingProfile = useAppStore((state) => state.profile);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const [step, setStep] = useState<number>(1);
  const [isCrunching, setIsCrunching] = useState<boolean>(false);

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
  const [marksError, setMarksError] = useState<string>('');

  // Step Validations
  const isStep1Valid = Boolean(formData.name && formData.name.trim().length >= 2);
  const isStep2Valid = Boolean(
    formData.state && formData.course && formData.level && formData.year,
  );
  const isStep3Valid = Boolean(formData.category);
  const isStep4Valid = Boolean(
    formData.marksPercent !== undefined &&
      formData.marksPercent >= 0 &&
      formData.marksPercent <= 100,
  );
  const isStep5Valid = Boolean(formData.incomeBracket);
  const isStep6Valid = true; // Optional toggles

  const handleNext = () => {
    if (step === 1) {
      if (!isStep1Valid) {
        setNameError('Please enter your full name (at least 2 characters)');
        return;
      }
      setNameError('');
    }

    if (step === 4) {
      if (!isStep4Valid) {
        setMarksError('Marks percentage must be between 0 and 100');
        return;
      }
      setMarksError('');
    }

    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      // Step 6 completed: run crunching transition and save profile
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = () => {
    setIsCrunching(true);

    const completeProfile: Profile = {
      name: formData.name || 'Student',
      gender: formData.gender || 'Female',
      state: formData.state || 'Maharashtra',
      course: formData.course || 'Engineering',
      level: formData.level || 'Undergraduate',
      year: formData.year || 1,
      category: formData.category || 'General',
      marksPercent: formData.marksPercent ?? 60,
      incomeBracket: formData.incomeBracket || 'unknown',
      hasDisability: formData.hasDisability || false,
      firstGenerationLearner: formData.firstGenerationLearner || false,
    };

    setTimeout(() => {
      completeOnboarding(completeProfile);
      navigate('/dashboard');
    }, 1200);
  };

  // Crunching Animation Screen
  if (isCrunching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-forest-900 flex items-center justify-center text-white shadow-pop animate-pulse">
            <Sparkles className="w-10 h-10 text-brand-500 animate-spin" />
          </div>
          <div className="absolute -inset-2 bg-brand-500/20 rounded-3xl blur-lg animate-ping -z-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight mb-2">
          Crunching your matches…
        </h2>
        <p className="text-sm text-ink-500 max-w-sm">
          Evaluating 30 scholarship rules, state quotas, and unlockable opportunities for {formData.name}.
        </p>
      </div>
    );
  }

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

        {/* STEP 4: Marks */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                Step 4 of 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-1">
                Your academic marks
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Enter your last exam aggregate percentage. Merit scholarships use this to determine eligibility.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between gap-4 p-5 bg-canvas/60 rounded-2xl border border-line">
                <div>
                  <span className="text-xs font-medium text-ink-500">
                    Last Exam Percentage
                  </span>
                  <div className="font-money text-4xl sm:text-5xl font-bold text-forest-900 tabular-nums">
                    {formData.marksPercent ?? 68}%
                  </div>
                </div>

                <div className="w-32">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.marksPercent ?? 68}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 100) {
                        setMarksError('');
                        setFormData({ ...formData, marksPercent: val });
                      }
                    }}
                    className="text-center font-bold text-lg"
                  />
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="35"
                  max="100"
                  step="1"
                  value={formData.marksPercent ?? 68}
                  onChange={(e) => {
                    setMarksError('');
                    setFormData({
                      ...formData,
                      marksPercent: Number(e.target.value),
                    });
                  }}
                  className="w-full h-2 bg-ink-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-xs text-ink-500 px-1 font-mono">
                  <span>35% (Pass)</span>
                  <span>60% (1st Class)</span>
                  <span>75% (Distinction)</span>
                  <span>100%</span>
                </div>
              </div>

              {marksError && (
                <p className="text-xs text-danger-600 font-medium">
                  {marksError}
                </p>
              )}

              <p className="text-xs text-ink-500 bg-surface border border-line p-3 rounded-xl">
                💡 Tip: If you scored near 70–75%, our Unlock engine will show you merit scholarships you can unlock by lifting your marks slightly.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Family Income */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                Step 5 of 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-1">
                Family annual income
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                Need-based schemes require family revenue under specific brackets. Select your current status.
              </p>
            </div>

            <div className="space-y-2.5">
              {INCOME_OPTIONS.map((inc) => {
                const isSelected = formData.incomeBracket === inc.value;
                const isUnknown = inc.value === 'unknown';

                return (
                  <div
                    key={inc.value}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        incomeBracket: inc.value as IncomeBracket,
                      })
                    }
                    className={clsx(
                      'p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 select-none',
                      isSelected
                        ? isUnknown
                          ? 'bg-unlock-50 border-unlock-500 shadow-xs'
                          : 'bg-brand-50/70 border-brand-500 shadow-xs'
                        : 'bg-surface border-line hover:border-ink-300 hover:bg-canvas/50',
                    )}
                  >
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? isUnknown
                            ? 'border-unlock-600 bg-unlock-600'
                            : 'border-brand-600 bg-brand-600'
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
                          isSelected
                            ? isUnknown
                              ? 'text-unlock-600'
                              : 'text-brand-900'
                            : 'text-ink-900',
                        )}
                      >
                        {inc.label}
                      </h4>
                      <p className="text-xs text-ink-500 mt-0.5">{inc.helper}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Anything else? */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                Step 6 of 6
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-1">
                Special circumstances
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                These optional flags unlock exclusive government & trust fellowships designed for social inclusion.
              </p>
            </div>

            <div className="space-y-4">
              {/* First-Gen Toggle */}
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    firstGenerationLearner: !formData.firstGenerationLearner,
                  })
                }
                className={clsx(
                  'p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 select-none',
                  formData.firstGenerationLearner
                    ? 'bg-brand-50/70 border-brand-500 shadow-xs'
                    : 'bg-surface border-line hover:border-ink-300',
                )}
              >
                <div
                  className={clsx(
                    'p-2.5 rounded-xl shrink-0',
                    formData.firstGenerationLearner
                      ? 'bg-brand-600 text-white'
                      : 'bg-ink-100 text-ink-500',
                  )}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-semibold text-ink-900">
                      First-Generation College Student
                    </h4>
                    <span
                      className={clsx(
                        'w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold',
                        formData.firstGenerationLearner
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink-300 bg-surface',
                      )}
                    >
                      {formData.firstGenerationLearner && '✓'}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500 mt-1">
                    First person in your immediate family pursuing an undergraduate degree. Unlocks Tata & state first-generation endowments.
                  </p>
                </div>
              </div>

              {/* Disability Toggle */}
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    hasDisability: !formData.hasDisability,
                  })
                }
                className={clsx(
                  'p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 select-none',
                  formData.hasDisability
                    ? 'bg-brand-50/70 border-brand-500 shadow-xs'
                    : 'bg-surface border-line hover:border-ink-300',
                )}
              >
                <div
                  className={clsx(
                    'p-2.5 rounded-xl shrink-0',
                    formData.hasDisability
                      ? 'bg-brand-600 text-white'
                      : 'bg-ink-100 text-ink-500',
                  )}
                >
                  <Accessibility className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-semibold text-ink-900">
                      Person with Benchmark Disability (PwD)
                    </h4>
                    <span
                      className={clsx(
                        'w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold',
                        formData.hasDisability
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink-300 bg-surface',
                      )}
                    >
                      {formData.hasDisability && '✓'}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500 mt-1">
                    Hold a government disability certificate / UDID card with 40%+ disability. Unlocks specialized assistive device and living stipends.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy reminder */}
            <div className="p-3.5 bg-canvas rounded-xl border border-line flex items-center gap-2.5 text-xs text-ink-500">
              <Users className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                All details are stored locally in your browser. Grantly operates without tracking or server accounts.
              </span>
            </div>
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
              (step === 3 && !isStep3Valid) ||
              (step === 4 && !isStep4Valid) ||
              (step === 5 && !isStep5Valid) ||
              (step === 6 && !isStep6Valid)
            }
            rightIcon={
              step === 6 ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )
            }
          >
            {step === 6 ? 'Calculate My Scholarships' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
