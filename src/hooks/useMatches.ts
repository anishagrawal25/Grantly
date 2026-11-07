import { useEffect, useMemo } from 'react';
import { SCHOLARSHIPS } from '../data/scholarships';
import { evaluate, summarize } from '../lib/eligibility';
import { useAppStore } from '../store/useAppStore';
import { MatchResult, MoneySummary, Scholarship } from '../types';

export interface UseMatchesReturn {
  matches: MatchResult[];
  byId: Record<string, { scholarship: Scholarship; match: MatchResult }>;
  summary: MoneySummary;
  scholarships: Scholarship[];
}

const EMPTY_SUMMARY: MoneySummary = {
  eligibleTotal: 0,
  unlockableTotal: 0,
  appliedTotal: 0,
  eligibleCount: 0,
  almostCount: 0,
  deadlinesSoon: 0,
  missingDocsCount: 0,
};

export function useMatches(): UseMatchesReturn {
  const profile = useAppStore((state) => state.profile);
  const heldDocs = useAppStore((state) => state.heldDocs);
  const applications = useAppStore((state) => state.applications);
  const deadlines = useAppStore((state) => state.deadlines);
  const ensureDeadlines = useAppStore((state) => state.ensureDeadlines);

  // Initialize persistent deadlines on first mount
  useEffect(() => {
    ensureDeadlines();
  }, [ensureDeadlines]);

  const result = useMemo(() => {
    if (!profile) {
      const byId: Record<string, { scholarship: Scholarship; match: MatchResult }> = {};
      const fallbackMatches: MatchResult[] = SCHOLARSHIPS.map((scholarship) => {
        const dummyMatch: MatchResult = {
          scholarshipId: scholarship.id,
          status: 'not-eligible',
          criteria: [],
          failingCount: 1,
          headline: 'Complete your profile to see eligibility',
        };
        byId[scholarship.id] = { scholarship, match: dummyMatch };
        return dummyMatch;
      });

      return {
        matches: fallbackMatches,
        byId,
        summary: EMPTY_SUMMARY,
        scholarships: SCHOLARSHIPS,
      };
    }

    const byId: Record<string, { scholarship: Scholarship; match: MatchResult }> = {};
    const matches: MatchResult[] = SCHOLARSHIPS.map((scholarship) => {
      const match = evaluate(profile, scholarship);
      byId[scholarship.id] = { scholarship, match };
      return match;
    });

    const summary = summarize(
      matches,
      SCHOLARSHIPS,
      applications,
      deadlines,
      heldDocs,
    );

    return {
      matches,
      byId,
      summary,
      scholarships: SCHOLARSHIPS,
    };
  }, [profile, heldDocs, applications, deadlines]);

  return result;
}
