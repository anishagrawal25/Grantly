import { describe, expect, it } from 'vitest';
import { Application, DocumentId, Profile, Scholarship } from '../types';
import { evaluate, summarize } from './eligibility';

const baseProfile: Profile = {
  name: 'Priya Deshmukh',
  state: 'Maharashtra',
  category: 'OBC',
  gender: 'Female',
  course: 'Engineering',
  level: 'Undergraduate',
  year: 2,
  marksPercent: 68,
  incomeBracket: '2.5L-5L',
  hasDisability: false,
  firstGenerationLearner: true,
};

const baseScholarship: Scholarship = {
  id: 'test-scholarship',
  name: 'Test Engineering Grant',
  provider: 'Test Foundation',
  providerType: 'Foundation',
  amount: 50000,
  shortDescription: 'Test short description',
  plainSummary: 'Test plain summary',
  eligibility: {
    courses: ['Engineering'],
    levels: ['Undergraduate'],
    maxIncomeBracket: '5L-8L',
    minMarks: 60,
  },
  requiredDocs: ['aadhaar', 'marksheet', 'income-certificate'],
  howToApply: ['Step 1', 'Step 2'],
  deadlineInDays: 30,
  officialUrl: 'https://example.com',
  tags: ['Engineering'],
};

describe('Eligibility Engine', () => {
  it('1. verifies income ordering: 2.5L-5L passes 5L-8L but fails under-2.5L', () => {
    const passing = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: { maxIncomeBracket: '5L-8L' },
    });
    expect(passing.status).toBe('eligible');

    const failing = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: { maxIncomeBracket: 'under-2.5L' },
    });
    expect(failing.status).toBe('not-eligible');
    const incomeCriterion = failing.criteria.find(
      (c) => c.key === 'maxIncomeBracket',
    );
    expect(incomeCriterion?.state).toBe('fail');
    expect(incomeCriterion?.closable).toBe(false);
  });

  it('2. unknown income results in "almost" status and unverified closable criterion', () => {
    const unknownIncomeProfile: Profile = {
      ...baseProfile,
      incomeBracket: 'unknown',
    };
    const res = evaluate(unknownIncomeProfile, {
      ...baseScholarship,
      eligibility: {
        courses: ['Engineering'],
        maxIncomeBracket: '5L-8L',
      },
    });
    expect(res.status).toBe('almost');
    expect(res.unlockStep).toContain('income certificate');
    const incomeCriterion = res.criteria.find(
      (c) => c.key === 'maxIncomeBracket',
    );
    expect(incomeCriterion?.state).toBe('unverified');
    expect(incomeCriterion?.closable).toBe(true);
  });

  it('3. marks gap <= 10 (gap 4) results in "almost" status with next step', () => {
    const res = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: {
        courses: ['Engineering'],
        minMarks: 72, // 72 - 68 = 4 gap
      },
    });
    expect(res.status).toBe('almost');
    expect(res.unlockStep).toBe('Raise your marks by 4 points');
  });

  it('4. marks gap > 10 (gap 15) results in "not-eligible" status and non-closable', () => {
    const res = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: {
        courses: ['Engineering'],
        minMarks: 83, // 83 - 68 = 15 gap
      },
    });
    expect(res.status).toBe('not-eligible');
    const marksCrit = res.criteria.find((c) => c.key === 'minMarks');
    expect(marksCrit?.state).toBe('fail');
    expect(marksCrit?.closable).toBe(false);
  });

  it('5. category mismatch results in "not-eligible" and is not closable', () => {
    const res = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: {
        categories: ['SC', 'ST'],
      },
    });
    expect(res.status).toBe('not-eligible');
    const catCrit = res.criteria.find((c) => c.key === 'categories');
    expect(catCrit?.state).toBe('fail');
    expect(catCrit?.closable).toBe(false);
    expect(res.headline).toContain('Open to SC, ST');
  });

  it('6. state restriction mismatch results in "not-eligible"', () => {
    const res = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: {
        states: ['Karnataka'],
      },
    });
    expect(res.status).toBe('not-eligible');
    expect(res.headline).toContain('Only for students from Karnataka');
  });

  it('7. two failures result in "not-eligible" even if one is closable', () => {
    const res = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: {
        states: ['Delhi'], // fail 1: non-closable
        minMarks: 72, // fail 2: gap 4 (closable)
      },
    });
    expect(res.failingCount).toBe(2);
    expect(res.status).toBe('not-eligible');
  });

  it('8. empty eligibility criteria evaluates to "eligible"', () => {
    const res = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: {},
    });
    expect(res.status).toBe('eligible');
    expect(res.criteria.length).toBe(0);
    expect(res.headline).toBe('You qualify: All general criteria met');
  });

  it('9. requiresFirstGen and requiresDisability evaluate correctly', () => {
    const firstGenPass = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: { requiresFirstGen: true },
    });
    expect(firstGenPass.status).toBe('eligible');

    const disabilityFail = evaluate(baseProfile, {
      ...baseScholarship,
      eligibility: { requiresDisability: true },
    });
    expect(disabilityFail.status).toBe('not-eligible');
  });

  it('10. summarize totals add up correctly across eligible, unlockable, and applied', () => {
    const s1: Scholarship = {
      ...baseScholarship,
      id: 's1',
      amount: 40000,
      requiredDocs: ['aadhaar', 'marksheet'],
    };
    const s2: Scholarship = {
      ...baseScholarship,
      id: 's2',
      amount: 60000,
      requiredDocs: ['aadhaar', 'income-certificate'],
    };
    const s3: Scholarship = {
      ...baseScholarship,
      id: 's3',
      amount: 50000,
      requiredDocs: ['aadhaar'],
    };

    const matches = [
      {
        scholarshipId: 's1',
        status: 'eligible' as const,
        criteria: [],
        failingCount: 0,
        headline: 'Qualify',
      },
      {
        scholarshipId: 's2',
        status: 'almost' as const,
        criteria: [],
        failingCount: 1,
        headline: 'Almost',
      },
      {
        scholarshipId: 's3',
        status: 'not-eligible' as const,
        criteria: [],
        failingCount: 2,
        headline: 'No',
      },
    ];

    const apps: Application[] = [
      {
        scholarshipId: 's1',
        stage: 'applied',
        updatedAt: new Date().toISOString(),
      },
    ];

    const deadlines = {
      s1: '2026-11-15T00:00:00.000Z',
      s2: '2026-11-12T00:00:00.000Z',
      s3: '2026-12-30T00:00:00.000Z',
    };

    const today = new Date('2026-11-07T00:00:00.000Z');
    const summary = summarize(
      matches,
      [s1, s2, s3],
      apps,
      deadlines,
      ['aadhaar'] as DocumentId[],
      today,
    );

    expect(summary.eligibleTotal).toBe(40000);
    expect(summary.unlockableTotal).toBe(60000);
    expect(summary.appliedTotal).toBe(40000);
    expect(summary.eligibleCount).toBe(1);
    expect(summary.almostCount).toBe(1);
    // s1 has deadline within 8 days but is applied. s2 has deadline within 5 days and is almost (not applied).
    expect(summary.deadlinesSoon).toBe(1);
    // s1 requires ['aadhaar', 'marksheet'], held is ['aadhaar'], missing is ['marksheet'] -> count 1
    expect(summary.missingDocsCount).toBe(1);
  });

  it('11. missingDocsCount de-duplicates required documents across eligible scholarships', () => {
    const s1: Scholarship = {
      ...baseScholarship,
      id: 's1',
      requiredDocs: ['income-certificate', 'marksheet'],
    };
    const s2: Scholarship = {
      ...baseScholarship,
      id: 's2',
      requiredDocs: ['income-certificate', 'admission-proof'],
    };

    const matches = [
      {
        scholarshipId: 's1',
        status: 'eligible' as const,
        criteria: [],
        failingCount: 0,
        headline: '',
      },
      {
        scholarshipId: 's2',
        status: 'eligible' as const,
        criteria: [],
        failingCount: 0,
        headline: '',
      },
    ];

    const summary = summarize(
      matches,
      [s1, s2],
      [],
      {},
      ['aadhaar'] as DocumentId[], // user does not have income, marksheet, or admission-proof
    );

    // unique missing docs: income-certificate, marksheet, admission-proof (3 total)
    expect(summary.missingDocsCount).toBe(3);
  });
});
