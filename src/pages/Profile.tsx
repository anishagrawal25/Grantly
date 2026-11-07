import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Sparkles,
  FileQuestion,
  RotateCcw,
  Save,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  IndianRupee,
  ShieldAlert,
} from 'lucide-react';
import { useAppStore, PRIYA_DEMO_PROFILE } from '../store/useAppStore';
import { Profile as ProfileType, Category, Course, Gender, IncomeBracket, Level } from '../types';
import {
  INDIAN_STATES,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  COURSE_OPTIONS,
  LEVEL_OPTIONS,
  INCOME_OPTIONS,
} from '../data/options';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast, ToastMessage } from '../components/ui/Toast';

export default function Profile() {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);
  const setProfile = useAppStore((state) => state.setProfile);
  const loadDemoPersona = useAppStore((state) => state.loadDemoPersona);
  const loadDemoNoIncomePersona = useAppStore((state) => state.loadDemoNoIncomePersona);
  const resetAll = useAppStore((state) => state.resetAll);

  // Draft profile form state
  const [draft, setDraft] = useState<ProfileType>(profile || PRIYA_DEMO_PROFILE);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Sync draft when store profile updates (e.g. demo loaders)
  useEffect(() => {
    if (profile) {
      setDraft(profile);
    }
  }, [profile]);

  const showToast = (message: Omit<ToastMessage, 'id'>) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    const newToast: ToastMessage = {
      ...message,
      id: String(Date.now()),
    };
    setToast(newToast);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(draft);
    showToast({
      tone: 'success',
      title: 'Profile Updated! 🎉',
      message: 'Your eligibility criteria and Money Meter have been recalculated.',
    });
  };

  const handleLoadDemoPriya = () => {
    loadDemoPersona();
    setDraft({ ...PRIYA_DEMO_PROFILE });
    showToast({
      tone: 'success',
      title: 'Demo Persona Loaded',
      message: 'Loaded Priya Deshmukh (B.Tech Year 2, OBC, Maharashtra).',
    });
  };

  const handleLoadDemoNoIncome = () => {
    loadDemoNoIncomePersona();
    setDraft({
      ...PRIYA_DEMO_PROFILE,
      incomeBracket: 'unknown',
    });
    showToast({
      tone: 'info',
      title: 'Demo Persona Loaded',
      message: 'Loaded demo profile with unverified income certificate.',
    });
  };

  const handleResetConfirm = () => {
    setShowResetModal(false);
    resetAll();
    showToast({
      tone: 'info',
      title: 'Data Cleared',
      message: 'All profile and application records have been reset.',
    });
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900 tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-brand-600" />
            <span>Student Profile</span>
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Update your academic details and criteria. All changes instantly re-evaluate scholarships in real time.
          </p>
        </div>

        {/* Demo Persona Quick Loaders */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLoadDemoPriya}
            leftIcon={<Sparkles className="w-4 h-4 text-brand-600" />}
          >
            Load Priya (Demo)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLoadDemoNoIncome}
            leftIcon={<FileQuestion className="w-4 h-4 text-unlock-600" />}
          >
            Load No Income (Demo)
          </Button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Card 1: Identity & Education */}
          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 shadow-card flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-3 border-b border-line">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-forest-900">
                Personal & Academic Details
              </h2>
            </div>

            <Input
              label="Full Name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Gender"
                value={draft.gender}
                onChange={(e) => setDraft({ ...draft, gender: e.target.value as Gender })}
                options={GENDER_OPTIONS}
              />

              <Select
                label="Social Category"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}
                options={CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
              />
            </div>

            <Select
              label="Home / Domicile State"
              value={draft.state}
              onChange={(e) => setDraft({ ...draft, state: e.target.value })}
              options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Education Level"
                value={draft.level}
                onChange={(e) => setDraft({ ...draft, level: e.target.value as Level })}
                options={LEVEL_OPTIONS}
              />

              <Select
                label="Course / Stream"
                value={draft.course}
                onChange={(e) => setDraft({ ...draft, course: e.target.value as Course })}
                options={COURSE_OPTIONS}
              />
            </div>

            <Select
              label="Year of Study"
              value={String(draft.year)}
              onChange={(e) => setDraft({ ...draft, year: parseInt(e.target.value, 10) })}
              options={[
                { value: '1', label: '1st Year' },
                { value: '2', label: '2nd Year' },
                { value: '3', label: '3rd Year' },
                { value: '4', label: '4th Year' },
                { value: '5', label: '5th Year' },
              ]}
            />
          </div>

          {/* Card 2: Financial & Eligibility Parameters */}
          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 shadow-card flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-line">
              <IndianRupee className="w-5 h-5 text-forest-700" />
              <h2 className="text-base font-bold text-forest-900">
                Income & Academic Score
              </h2>
            </div>

            {/* Marks percentage */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="marks-range" className="text-sm font-medium text-ink-900">
                  Last Exam Score (Marks %)
                </label>
                <span className="text-sm font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                  {draft.marksPercent}%
                </span>
              </div>
              <input
                id="marks-range"
                type="range"
                min="35"
                max="100"
                step="1"
                value={draft.marksPercent}
                onChange={(e) => setDraft({ ...draft, marksPercent: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <p className="text-xs text-ink-500">
                Used to determine eligibility for merit-based scholarships (e.g. Reliance, Mahindra).
              </p>
            </div>

            {/* Income Bracket */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink-900">
                Family Annual Income Bracket
              </span>
              <div className="flex flex-col gap-2">
                {INCOME_OPTIONS.map((opt) => {
                  const isSelected = draft.incomeBracket === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/40 text-forest-900 shadow-xs'
                          : 'border-line hover:border-ink-300 bg-canvas/40 text-ink-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="incomeBracket"
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => setDraft({ ...draft, incomeBracket: opt.value as IncomeBracket })}
                        className="mt-1 accent-brand-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
                        <span className="text-[11px] text-ink-500">{opt.helper}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Special Criteria Toggles */}
            <div className="flex flex-col gap-3 pt-2 border-t border-line">
              <span className="text-xs font-bold text-ink-700 uppercase tracking-wider">
                Special Criteria
              </span>

              {/* First-Gen Learner */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-line bg-canvas/40 hover:bg-canvas cursor-pointer transition-colors">
                <div className="flex flex-col pr-3">
                  <span className="text-xs sm:text-sm font-semibold text-ink-900">
                    First-Generation College Student
                  </span>
                  <span className="text-[11px] text-ink-500">
                    First in your immediate family to pursue higher degree education
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={draft.firstGenerationLearner}
                  onChange={(e) => setDraft({ ...draft, firstGenerationLearner: e.target.checked })}
                  className="w-5 h-5 accent-brand-600 rounded cursor-pointer shrink-0"
                />
              </label>

              {/* PwD Disability */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-line bg-canvas/40 hover:bg-canvas cursor-pointer transition-colors">
                <div className="flex flex-col pr-3">
                  <span className="text-xs sm:text-sm font-semibold text-ink-900">
                    Person with Disability (PwD)
                  </span>
                  <span className="text-[11px] text-ink-500">
                    Recognized benchmark disability (40% or more)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={draft.hasDisability}
                  onChange={(e) => setDraft({ ...draft, hasDisability: e.target.checked })}
                  className="w-5 h-5 accent-brand-600 rounded cursor-pointer shrink-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-line shadow-xs">
          <p className="text-xs text-ink-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
            <span>Saved on your device. Never shared with external servers.</span>
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (profile) setDraft(profile);
              }}
              className="flex-1 sm:flex-initial"
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-danger-200 bg-danger-50/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-danger-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-danger-600" />
            Reset Application Data
          </h3>
          <p className="text-xs text-ink-600 mt-1 max-w-xl">
            Clear all cached profile preferences, uploaded wallet documents, and tracked applications.
            This resets Grantly back to a clean initial state.
          </p>
        </div>

        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => setShowResetModal(true)}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="shrink-0"
        >
          Reset All Data
        </Button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Data?"
        description="This action cannot be undone."
        maxWidth="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetConfirm}>
              Yes, Reset Everything
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 text-ink-700 text-sm">
          <AlertTriangle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
          <p>
            Are you sure you want to clear your profile, wallet documents, and saved applications? You will be
            redirected to the welcome screen.
          </p>
        </div>
      </Modal>

      {/* Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
