import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';
import { FilterState, MatchStatus } from '../../types';

export interface MobileFilterDrawerProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  counts: {
    all: number;
    eligible: number;
    almost: number;
    'not-eligible': number;
  };
}

const PROVIDER_TYPES = ['Government', 'Private', 'Foundation', 'State'];

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  filters,
  onFilterChange,
  onReset,
  counts,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Temporary local state for drawer before applying
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const openDrawer = () => {
    setLocalFilters(filters);
    setIsOpen(true);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    onReset();
    setIsOpen(false);
  };

  const handleToggleProvider = (type: string) => {
    const current = localFilters.providerTypes;
    const exists = current.includes(type);
    setLocalFilters({
      ...localFilters,
      providerTypes: exists
        ? current.filter((t) => t !== type)
        : [...current, type],
    });
  };

  // Count active filters
  let activeCount = 0;
  if (filters.status !== 'all') activeCount++;
  if (filters.providerTypes.length > 0) activeCount += filters.providerTypes.length;
  if (filters.minAmount > 0) activeCount++;
  if (filters.deadlineWithin !== null) activeCount++;
  if (filters.query.trim()) activeCount++;

  const statusTabs = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'eligible', label: 'Qualify', count: counts.eligible },
    { id: 'almost', label: 'Almost', count: counts.almost },
    { id: 'not-eligible', label: 'No Match', count: counts['not-eligible'] },
  ];

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={openDrawer}
        leftIcon={<SlidersHorizontal className="w-4 h-4 text-ink-700" />}
        className="w-full sm:w-auto relative justify-between sm:justify-center"
      >
        <span>Filters & Sort</span>
        {activeCount > 0 && (
          <span className="ml-2 w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filter Scholarships"
        description="Refine displayed grants by eligibility, amount, and deadline."
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset All
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Apply Filters
            </Button>
          </div>
        }
      >
        <div className="space-y-5 py-2">
          {/* Status Tab Filter */}
          <div>
            <label className="block text-xs font-bold text-ink-900 uppercase tracking-wider mb-2">
              Eligibility Status
            </label>
            <Tabs
              tabs={statusTabs}
              activeTab={localFilters.status}
              onChange={(tabId) =>
                setLocalFilters({
                  ...localFilters,
                  status: tabId as MatchStatus | 'all',
                })
              }
            />
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-bold text-ink-900 uppercase tracking-wider mb-1.5">
              Search Keywords
            </label>
            <Input
              placeholder="e.g. Maharashtra, engineering, AICTE…"
              value={localFilters.query}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, query: e.target.value })
              }
            />
          </div>

          {/* Provider Type Chips */}
          <div>
            <label className="block text-xs font-bold text-ink-900 uppercase tracking-wider mb-2">
              Provider Category
            </label>
            <div className="flex flex-wrap gap-2">
              {PROVIDER_TYPES.map((type) => (
                <Chip
                  key={type}
                  selected={localFilters.providerTypes.includes(type)}
                  onClick={() => handleToggleProvider(type)}
                >
                  {type}
                </Chip>
              ))}
            </div>
          </div>

          {/* Min Amount & Deadline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Minimum Amount"
              value={String(localFilters.minAmount)}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  minAmount: Number(e.target.value),
                })
              }
              options={[
                { value: '0', label: 'Any Amount' },
                { value: '25000', label: '₹25,000+' },
                { value: '50000', label: '₹50,000+' },
                { value: '100000', label: '₹1,00,000+' },
              ]}
            />

            <Select
              label="Application Deadline"
              value={
                localFilters.deadlineWithin
                  ? String(localFilters.deadlineWithin)
                  : 'all'
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
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
          <Select
            label="Sort Results By"
            value={localFilters.sort}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                sort: e.target.value as 'match' | 'amount' | 'deadline',
              })
            }
            options={[
              { value: 'match', label: 'Best Match (Eligible First)' },
              { value: 'amount', label: 'Highest Annual Amount' },
              { value: 'deadline', label: 'Nearest Deadline First' },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};
