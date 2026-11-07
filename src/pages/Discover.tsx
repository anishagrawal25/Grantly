import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FilterBar } from '../components/scholarships/FilterBar';
import { MobileFilterDrawer } from '../components/scholarships/MobileFilterDrawer';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useMatches } from '../hooks/useMatches';
import { getDaysRemaining } from '../lib/dates';
import { useAppStore } from '../store/useAppStore';
import { FilterState, MatchStatus, Scholarship } from '../types';

export default function Discover() {
  const shouldReduceMotion = useReducedMotion();
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const deadlines = useAppStore((state) => state.deadlines);

  const { matches, byId, scholarships } = useMatches();

  // Compute status counts across all scholarships
  const counts = useMemo(() => {
    let eligible = 0;
    let almost = 0;
    let notEligible = 0;

    for (const m of matches) {
      if (m.status === 'eligible') eligible++;
      else if (m.status === 'almost') almost++;
      else notEligible++;
    }

    return {
      all: scholarships.length,
      eligible,
      almost,
      'not-eligible': notEligible,
    };
  }, [matches, scholarships.length]);

  // Apply filters
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      const match = byId[s.id]?.match;
      if (!match) return false;

      // Status filter
      if (filters.status !== 'all' && match.status !== filters.status) {
        return false;
      }

      // Query filter (name, provider, tags)
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesProvider = s.provider.toLowerCase().includes(q);
        const matchesTag = s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesProvider && !matchesTag) {
          return false;
        }
      }

      // Provider types filter
      if (
        filters.providerTypes.length > 0 &&
        !filters.providerTypes.includes(s.providerType)
      ) {
        return false;
      }

      // Minimum amount filter
      if (filters.minAmount > 0 && s.amount < filters.minAmount) {
        return false;
      }

      // Deadline filter
      if (filters.deadlineWithin !== null) {
        const deadlineIso = deadlines[s.id];
        const days = deadlineIso
          ? getDaysRemaining(deadlineIso)
          : s.deadlineInDays;
        if (days < 0 || days > filters.deadlineWithin) {
          return false;
        }
      }

      return true;
    });
  }, [scholarships, byId, filters, deadlines]);

  // Sorting
  const sortedScholarships = useMemo(() => {
    const list = [...filteredScholarships];

    const statusWeight: Record<MatchStatus, number> = {
      eligible: 3,
      almost: 2,
      'not-eligible': 1,
    };

    if (filters.sort === 'match') {
      return list.sort((a, b) => {
        const matchA = byId[a.id]?.match;
        const matchB = byId[b.id]?.match;
        const weightA = matchA ? statusWeight[matchA.status] : 0;
        const weightB = matchB ? statusWeight[matchB.status] : 0;

        if (weightA !== weightB) {
          return weightB - weightA;
        }
        // Tie-break by amount descending
        return b.amount - a.amount;
      });
    }

    if (filters.sort === 'amount') {
      return list.sort((a, b) => b.amount - a.amount);
    }

    if (filters.sort === 'deadline') {
      return list.sort((a, b) => {
        const deadA = deadlines[a.id]
          ? getDaysRemaining(deadlines[a.id])
          : a.deadlineInDays;
        const deadB = deadlines[b.id]
          ? getDaysRemaining(deadlines[b.id])
          : b.deadlineInDays;
        return deadA - deadB;
      });
    }

    return list;
  }, [filteredScholarships, byId, filters.sort, deadlines]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters(updated);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Mobile Filter Trigger */}
      <PageHeader
        title="Discover Scholarships"
        subtitle={`Showing ${sortedScholarships.length} of ${scholarships.length} grants matched to your verified profile`}
        action={
          <div className="lg:hidden w-full sm:w-auto">
            <MobileFilterDrawer
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              counts={counts}
            />
          </div>
        }
      />

      {/* Desktop Filter Bar (hidden on mobile, sticky on desktop) */}
      <div className="hidden lg:block sticky top-16 z-30 bg-canvas/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-line shadow-xs">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          counts={counts}
        />
      </div>

      {/* Results Grid or Empty State */}
      {sortedScholarships.length === 0 ? (
        <div className="py-12 flex justify-center">
          <EmptyState
            illustration="search"
            title="No matching scholarships found"
            description="No scholarships match your active filter criteria. Try clearing search keywords, adjusting minimum amounts, or resetting all filters."
            action={
              <Button variant="primary" onClick={resetFilters}>
                Reset All Filters
              </Button>
            }
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.04,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {sortedScholarships.map((scholarship: Scholarship) => {
            const match = byId[scholarship.id]?.match;
            if (!match) return null;

            return (
              <motion.div
                key={scholarship.id}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                }}
              >
                <ScholarshipCard
                  scholarship={scholarship}
                  match={match}
                  deadlineIso={deadlines[scholarship.id]}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
