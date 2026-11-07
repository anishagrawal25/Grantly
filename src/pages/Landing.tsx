import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';

export default function Landing() {
  const navigate = useNavigate();
  const loadDemoPersona = useAppStore((state) => state.loadDemoPersona);
  const onboarded = useAppStore((state) => state.onboarded);

  const handleTryDemo = () => {
    loadDemoPersona();
    navigate('/dashboard');
  };

  return (
    <div className="py-6 sm:py-12 md:py-16">
      {/* Top already onboarded banner if returning */}
      {onboarded && (
        <div className="mb-8 p-3.5 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-xs sm:text-sm font-medium text-brand-700">
              Welcome back! Your scholarship profile is saved on this device.
            </span>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/dashboard')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Go to Dashboard
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900/5 border border-forest-900/10 text-forest-900 text-xs sm:text-sm font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>Funding Intelligence for Indian Students</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink-900 tracking-tight leading-[1.12] mb-5">
            See the funding you're eligible for.{' '}
            <span className="text-brand-600">Claim it.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-ink-700 leading-relaxed mb-8 max-w-xl">
            Tell Grantly about yourself once. We'll show the scholarships you
            can actually get, what you're missing to unlock more, and what to do
            next.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-6">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/onboarding')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-base font-semibold shadow-md"
            >
              Find my scholarships
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={handleTryDemo}
              leftIcon={<Sparkles className="w-4 h-4 text-unlock-500" />}
              className="text-base font-semibold"
            >
              Try demo student
            </Button>
          </div>

          {/* Trust Line */}
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>No sign-up. Your data stays securely on your device.</span>
          </div>

          {/* Feature Highlights Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 mt-10 border-t border-line/80 w-full">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-ink-900">
                  Match with reasons
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Plain-language eligibility breakdown for every single grant.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-unlock-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-ink-900">
                  Unlock what's missing
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                  See how small fixes like income certificates open more funding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-info-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-ink-900">
                  Track every deadline
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Visual roadmap stepper from document prep to final outcome.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Money Meter Preview Card */}
        <div className="lg:col-span-5 w-full">
          <Card
            variant="hero"
            className="p-6 sm:p-8 bg-forest-900 rounded-3xl relative overflow-hidden shadow-pop"
          >
            {/* Subtle radial glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-forest-600/35 rounded-full blur-3xl pointer-events-none" />

            {/* Faded ₹ glyph in background */}
            <div className="absolute right-3 -bottom-8 font-money text-[180px] sm:text-[220px] font-bold text-white/5 select-none pointer-events-none leading-none">
              ₹
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-100/80">
                  Your Scholarship Potential
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/15">
                  Example Preview
                </span>
              </div>

              {/* Sample Amount */}
              <div className="font-money text-3xl min-[360px]:text-4xl sm:text-6xl font-bold tracking-tight text-white mb-2 tabular-nums">
                ₹4,01,000
              </div>

              <p className="text-xs sm:text-sm text-ink-100/90 mb-6">
                across 8 scholarships you qualify for right now
              </p>

              {/* Meter tick scale */}
              <div className="w-full mb-2">
                <div className="flex justify-between text-[10px] text-white/30 px-1 mb-1 font-mono">
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                </div>
                {/* 3-segment bar preview */}
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex p-0.5 gap-1">
                  <div className="h-full bg-brand-500 rounded-full w-[60%]" />
                  <div className="h-full bg-unlock-500 rounded-full w-[25%]" />
                  <div className="h-full bg-white/60 rounded-full w-[15%]" />
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-[11px]">
                <div>
                  <div className="flex items-center gap-1.5 text-brand-100">
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    <span>Eligible</span>
                  </div>
                  <p className="font-money font-semibold text-white mt-0.5">
                    ₹4,01,000
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-unlock-100">
                    <span className="w-2 h-2 rounded-full bg-unlock-500" />
                    <span>Unlockable</span>
                  </div>
                  <p className="font-money font-semibold text-white mt-0.5">
                    ₹2,15,000
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-white/80" />
                    <span>Applied</span>
                  </div>
                  <p className="font-money font-semibold text-white mt-0.5">
                    ₹50,000
                  </p>
                </div>
              </div>

              {/* Try Demo CTA directly in card */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/70">
                  Ready to test with Priya Deshmukh?
                </span>
                <button
                  type="button"
                  onClick={handleTryDemo}
                  className="text-xs font-semibold text-brand-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  Load demo student →
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
