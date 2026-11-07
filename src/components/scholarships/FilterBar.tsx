import React from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';
import { FilterState, MatchStatus } from '../../types';

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  counts: {
    all: number;
    eligible: number;
    almost: number;
    'not-eligible': number;
  };
  className?: string;
}

const PROVIDER_TYPES = ['Government', 'Private', 'Foundation', 'State'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  counts,
  className,
}) => {
  const statusTabs = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'eligible', label: 'You qualify', count: counts.eligible },
    { id: 'almost', label: 'Almost eligible', count: counts.almost },
    { id: 'not-eligible', label: 'Not a match', count: counts['not-eligible'] },
  ];

  const handleToggleProvider = (type: string) => {
    const current = filters.providerTypes;
    const exists = current.includes(type);
    onFilterChange({
      providerTypes: exists
        ? current.filter((t) => t !== type)
        : [...current, type],
    });
  };

  const isFiltered =
    filters.query !== '' ||
    filters.providerTypes.length > 0 ||
    filters.minAmount > 0 ||
    filters.deadlineWithin !== null ||
    filters.status !== 'all' ||
    filters.sort !== 'match';

  return (
    <div className={className}>
      {/* Search Input & Status Tabs Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        {/* Status Filter Tabs */}
        <div className="overflow-x-auto">
          <Tabs
            tabs={statusTabs}
            activeTab={filters.status}
            onChange={(tabId) =>
              onFilterChange({ status: tabId as MatchStatus | 'all' })
            }
          />
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by name, provider, tags…"
            value={filters.query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
            leftIcon={<Search className="w-4 h-4 text-ink-500" />}
            className="bg-surface text-sm"
          />
        </div>
      </div>

      {/* Filter Chips & Select Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-500 mr-1 hidden sm:inline">
            Provider:
          </span>
          {PROVIDER_TYPES.map((type) => (
            <Chip
              key={type}
              selected={filters.providerTypes.includes(type)}
              onClick={() => handleToggleProvider(type)}
            >
              {type}
            </Chip>
          ))}
        </div>

        {/* Dropdown Filters & Sort */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Min Amount */}
          <div className="w-32 sm:w-36">
            <Select
              value={String(filters.minAmount)}
              onChange={(e) =>
                onFilterChange({ minAmount: Number(e.target.value) })
              }
              options={[
                { value: '0', label: 'Any Amount' },
                { value: '25000', label: '₹25,000+' },
                { value: '50000', label: '₹50,000+' },
                { value: '100000', label: '₹1,00,000+' },
              ]}
            />
          </div>

          {/* Deadline */}
          <div className="w-36 sm:w-40">
            <Select
              value={filters.deadlineWithin ? String(filters.deadlineWithin) : 'all'}
              onChange={(e) =>
                onFilterChange({
                  deadlineWithin:
                    e.target.value === 'all' ? null : Number(e.target.value),
                })
              }
              options={[
                { value: 'all', label: 'Any Deadline' },
                { value: '14', label: 'Within 14 days' },
                { value: '30', label: 'Within 30 days' },
                { value: '60', label: 'Within 60 days' },
              ]}
            />
          </div>

          {/* Sort By */}
          <div className="w-36 sm:w-40">
            <Select
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({
                  sort: e.target.value as 'match' | 'amount' | 'deadline',
                })
              }
              options={[
                { value: 'match', label: 'Best Match' },
                { value: 'amount', label: 'Highest Amount' },
                { value: 'deadline', label: 'Nearest Deadline' },
              ]}
            />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-900 px-2 py-2 rounded-lg hover:bg-ink-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
