import {
  Application,
  CriterionResult,
  DocumentId,
  IncomeBracket,
  MatchResult,
  MatchStatus,
  MoneySummary,
  Profile,
  Scholarship,
} from '../types';
import { getDaysRemaining } from './dates';

export const INCOME_INDEX: Record<Exclude<IncomeBracket, 'unknown'>, number> = {
  'under-2.5L': 0,
  '2.5L-5L': 1,
  '5L-8L': 2,
  'above-8L': 3,
};

export const INCOME_LABELS: Record<IncomeBracket, string> = {
  'under-2.5L': 'Under ₹2.5L',
  '2.5L-5L': '₹2.5L–₹5L',
  '5L-8L': '₹5L–₹8L',
  'above-8L': 'Above ₹8L',
  unknown: 'Income unverified',
};

/**
 * Evaluates individual criteria for a scholarship against a user profile.
 * Pure function: takes profile and scholarship, returns array of CriterionResult.
 */
export function evaluateCriteria(
  profile: Profile,
  scholarship: Scholarship,
): CriterionResult[] {
  const { eligibility } = scholarship;
  const results: CriterionResult[] = [];

  // 1. maxIncomeBracket
  if (eligibility.maxIncomeBracket !== undefined) {
    const maxAllowed = eligibility.maxIncomeBracket;
    const allowedIndex =
      maxAllowed === 'unknown' ? 3 : INCOME_INDEX[maxAllowed];
    const maxLabel =
      maxAllowed === 'under-2.5L'
        ? 'Family income under ₹2.5L'
        : maxAllowed === '2.5L-5L'
          ? 'Family income up to ₹5L'
          : maxAllowed === '5L-8L'
            ? 'Family income up to ₹8L'
            : 'Family income';

    if (profile.incomeBracket === 'unknown') {
      results.push({
        key: 'maxIncomeBracket',
        label: maxLabel,
        state: 'unverified',
        detail: 'Income certificate needed to confirm',
        closable: true,
        nextStep: 'Obtain an income certificate from your local revenue office',
      });
    } else {
      const userIndex = INCOME_INDEX[profile.incomeBracket];
      const passes = userIndex <= allowedIndex;
      results.push({
        key: 'maxIncomeBracket',
        label: maxLabel,
        state: passes ? 'pass' : 'fail',
        detail: passes
          ? `Your income: ${INCOME_LABELS[profile.incomeBracket]} ✓`
          : 'Income above limit',
        closable: false,
      });
    }
  }

  // 2. minMarks
  if (eligibility.minMarks !== undefined) {
    const min = eligibility.minMarks;
    const userMarks = profile.marksPercent;
    const passes = userMarks >= min;
    const gap = min - userMarks;
    const closable = !passes && gap <= 10 && gap > 0;

    results.push({
      key: 'minMarks',
      label: `Minimum ${min}% marks`,
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? `Your marks: ${userMarks}% (Needs ${min}%) ✓`
        : `Needs ${min}%, you have ${userMarks}%`,
      closable,
      nextStep: closable ? `Raise your marks by ${gap} points` : undefined,
    });
  }

  // 3. categories
  if (eligibility.categories && eligibility.categories.length > 0) {
    const passes = eligibility.categories.includes(profile.category);
    results.push({
      key: 'categories',
      label: `Open to ${eligibility.categories.join(', ')}`,
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? `Your category: ${profile.category} ✓`
        : `Open to ${eligibility.categories.join(', ')}`,
      closable: false,
    });
  }

  // 4. genders
  if (eligibility.genders && eligibility.genders.length > 0) {
    const passes = eligibility.genders.includes(profile.gender);
    results.push({
      key: 'genders',
      label: `For ${eligibility.genders.join(' / ')} students`,
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? `Your gender: ${profile.gender} ✓`
        : `Open to ${eligibility.genders.join(', ')}`,
      closable: false,
    });
  }

  // 5. states
  if (eligibility.states && eligibility.states.length > 0) {
    const passes = eligibility.states.includes(profile.state);
    results.push({
      key: 'states',
      label: `Students from ${eligibility.states.join(', ')}`,
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? `Your state: ${profile.state} ✓`
        : `Only for students from ${eligibility.states.join(', ')}`,
      closable: false,
    });
  }

  // 6. courses
  if (eligibility.courses && eligibility.courses.length > 0) {
    const passes = eligibility.courses.includes(profile.course);
    results.push({
      key: 'courses',
      label: `For ${eligibility.courses.join(', ')} students`,
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? `Your course: ${profile.course} ✓`
        : `For ${eligibility.courses.join(', ')} students`,
      closable: false,
    });
  }

  // 7. levels
  if (eligibility.levels && eligibility.levels.length > 0) {
    const passes = eligibility.levels.includes(profile.level);
    results.push({
      key: 'levels',
      label: `For ${eligibility.levels.join(', ')} level`,
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? `Your level: ${profile.level} ✓`
        : `For ${eligibility.levels.join(', ')} level`,
      closable: false,
    });
  }

  // 8. years
  if (eligibility.years && eligibility.years.length > 0) {
    const passes = eligibility.years.includes(profile.year);
    results.push({
      key: 'years',
      label: `For study year ${eligibility.years.join(', ')}`,
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? `Your year: Year ${profile.year} ✓`
        : `For year ${eligibility.years.join(', ')}`,
      closable: false,
    });
  }

  // 9. requiresDisability
  if (eligibility.requiresDisability) {
    const passes = profile.hasDisability === true;
    results.push({
      key: 'requiresDisability',
      label: 'For students with disabilities',
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? 'Disability criterion satisfied ✓'
        : 'For students with disabilities',
      closable: false,
    });
  }

  // 10. requiresFirstGen
  if (eligibility.requiresFirstGen) {
    const passes = profile.firstGenerationLearner === true;
    results.push({
      key: 'requiresFirstGen',
      label: 'For first-generation learners',
      state: passes ? 'pass' : 'fail',
      detail: passes
        ? 'First-generation learner ✓'
        : 'For first-generation learners',
      closable: false,
    });
  }

  return results;
}

/**
 * Evaluates a single scholarship against a profile to produce a MatchResult.
 * Pure function: deterministic calculation of status, headline, criteria, and unlockStep.
 */
export function evaluate(
  profile: Profile,
  scholarship: Scholarship,
): MatchResult {
  const criteria = evaluateCriteria(profile, scholarship);
  const failing = criteria.filter((c) => c.state === 'fail');
  const unverified = criteria.filter((c) => c.state === 'unverified');
  const problemCriteria = [...failing, ...unverified];
  const failingCount = problemCriteria.length;

  let status: MatchStatus = 'not-eligible';
  let headline = '';
  let unlockStep: string | undefined = undefined;

  if (failingCount === 0) {
    status = 'eligible';
    const passing = criteria.filter((c) => c.state === 'pass');
    if (passing.length > 0) {
      const details = passing
        .slice(0, 2)
        .map((c) => c.detail.replace(/ ✓$/, ''))
        .join(' · ');
      headline = `You qualify: ${details}`;
    } else {
      headline = 'You qualify: All general criteria met';
    }
  } else if (failingCount === 1 && problemCriteria[0].closable) {
    status = 'almost';
    const problem = problemCriteria[0];
    unlockStep = problem.nextStep;
    headline = `Almost there: ${problem.detail}`;
  } else {
    status = 'not-eligible';
    const firstFail = failing[0] || unverified[0];
    headline = `Not a match: ${firstFail ? firstFail.detail : 'Criteria not met'}`;
  }

  return {
    scholarshipId: scholarship.id,
    status,
    criteria,
    failingCount,
    headline,
    unlockStep,
  };
}

/**
 * Calculates money metrics across all scholarships and applications.
 * Pure function: deterministic summary calculation.
 */
export function summarize(
  matches: MatchResult[],
  scholarships: Scholarship[],
  applications: Application[],
  deadlines: Record<string, string>,
  heldDocs: DocumentId[] = [],
  today: Date = new Date(),
): MoneySummary {
  const sMap = new Map<string, Scholarship>(scholarships.map((s) => [s.id, s]));
  const appMap = new Map<string, Application>(
    applications.map((a) => [a.scholarshipId, a]),
  );

  let eligibleTotal = 0;
  let unlockableTotal = 0;
  let eligibleCount = 0;
  let almostCount = 0;
  let deadlinesSoon = 0;
  const missingDocsSet = new Set<DocumentId>();

  for (const match of matches) {
    const scholarship = sMap.get(match.scholarshipId);
    if (!scholarship) continue;

    const app = appMap.get(match.scholarshipId);
    const isApplied = app?.stage === 'applied' || app?.stage === 'awarded';

    if (match.status === 'eligible') {
      eligibleTotal += scholarship.amount;
      eligibleCount++;

      for (const doc of scholarship.requiredDocs) {
        if (!heldDocs.includes(doc)) {
          missingDocsSet.add(doc);
        }
      }
    }

    if (match.status === 'almost') {
      unlockableTotal += scholarship.amount;
      almostCount++;
    }

    if ((match.status === 'eligible' || match.status === 'almost') && !isApplied) {
      const deadlineIso = deadlines[scholarship.id];
      if (deadlineIso) {
        const days = getDaysRemaining(deadlineIso, today);
        if (days >= 0 && days <= 14) {
          deadlinesSoon++;
        }
      }
    }
  }

  // Calculate appliedTotal from applications that are 'applied' or 'awarded'
  let appliedTotal = 0;
  for (const app of applications) {
    if (app.stage === 'applied' || app.stage === 'awarded') {
      const sc = sMap.get(app.scholarshipId);
      if (sc) {
        appliedTotal += sc.amount;
      }
    }
  }

  return {
    eligibleTotal,
    unlockableTotal,
    appliedTotal,
    eligibleCount,
    almostCount,
    deadlinesSoon,
    missingDocsCount: missingDocsSet.size,
  };
}
