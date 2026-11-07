import React, { useState } from 'react';
import { Bookmark, Clock, Send, Trophy } from 'lucide-react';
import { Application, ApplicationStage, DocumentId, MatchResult, Scholarship } from '../../types';
import { formatINR } from '../../lib/money';
import { getDaysRemaining } from '../../lib/dates';
import { TrackerCard } from './TrackerCard';

export interface KanbanBoardProps {
  applications: Application[];
  scholarshipsById: Record<string, { scholarship: Scholarship; match: MatchResult }>;
  deadlines: Record<string, string>;
  heldDocs: DocumentId[];
  onStageChange: (scholarshipId: string, stage: ApplicationStage) => void;
  onRemove: (scholarshipId: string) => void;
}

interface ColumnDef {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  stages: ApplicationStage[];
  color: string;
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'saved',
    title: 'Saved',
    icon: Bookmark,
    stages: ['saved'],
    color: 'border-brand-500 text-brand-700 bg-brand-50/50',
  },
  {
    id: 'preparing',
    title: 'Preparing',
    icon: Clock,
    stages: ['preparing'],
    color: 'border-unlock-500 text-unlock-700 bg-unlock-50/50',
  },
  {
    id: 'applied',
    title: 'Applied',
    icon: Send,
    stages: ['applied'],
    color: 'border-forest-600 text-forest-800 bg-forest-50/50',
  },
  {
    id: 'outcome',
    title: 'Outcome',
    icon: Trophy,
    stages: ['awarded', 'rejected'],
    color: 'border-purple-500 text-purple-700 bg-purple-50/50',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  scholarshipsById,
  deadlines,
  heldDocs,
  onStageChange,
  onRemove,
}) => {
  const [mobileTab, setMobileTab] = useState<string>('saved');

  // Helper to sort applications by deadline
  const getSortedAppsForStages = (stages: ApplicationStage[]) => {
    return applications
      .filter((app) => stages.includes(app.stage))
      .sort((a, b) => {
        const itemA = scholarshipsById[a.scholarshipId];
        const itemB = scholarshipsById[b.scholarshipId];
        if (!itemA || !itemB) return 0;
        const daysA = deadlines[a.scholarshipId]
          ? getDaysRemaining(deadlines[a.scholarshipId])
          : itemA.scholarship.deadlineInDays;
        const daysB = deadlines[b.scholarshipId]
          ? getDaysRemaining(deadlines[b.scholarshipId])
          : itemB.scholarship.deadlineInDays;
        return daysA - daysB;
      });
  };

  const calculateTotalAmount = (apps: Application[]) => {
    return apps.reduce((sum, app) => {
      const item = scholarshipsById[app.scholarshipId];
      return sum + (item ? item.scholarship.amount : 0);
    }, 0);
  };

  return (
    <div className="w-full">
      {/* Mobile Tabs */}
      <div className="flex md:hidden overflow-x-auto gap-2 p-1 mb-4 bg-ink-50 rounded-xl border border-line">
        {COLUMNS.map((col) => {
          const apps = getSortedAppsForStages(col.stages);
          const isActive = mobileTab === col.id;
          const Icon = col.icon;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setMobileTab(col.id)}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-surface text-forest-900 shadow-xs border border-line'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{col.title}</span>
              <span className="text-[10px] bg-ink-200/60 px-1.5 py-0.2 rounded-full font-bold">
                {apps.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop 4-Column Grid */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const apps = getSortedAppsForStages(col.stages);
          const totalAmount = calculateTotalAmount(apps);
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className="bg-canvas/50 rounded-2xl border border-line/80 p-3.5 flex flex-col gap-3 min-h-[420px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${col.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-forest-900">
                    {col.title}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">
                    {apps.length}
                  </span>
                </div>
                {totalAmount > 0 && (
                  <span className="text-xs font-bold text-forest-800 font-display">
                    {formatINR(totalAmount)}
                  </span>
                )}
              </div>

              {/* Column Cards */}
              <div className="flex flex-col gap-3">
                {apps.length === 0 ? (
                  <div className="py-12 px-4 text-center rounded-xl border border-dashed border-line flex flex-col items-center justify-center">
                    <p className="text-xs text-ink-500 font-medium">No scholarships in this stage</p>
                  </div>
                ) : (
                  apps.map((app) => {
                    const item = scholarshipsById[app.scholarshipId];
                    if (!item) return null;
                    return (
                      <TrackerCard
                        key={app.scholarshipId}
                        application={app}
                        scholarship={item.scholarship}
                        heldDocs={heldDocs}
                        deadlineIso={deadlines[app.scholarshipId]}
                        onStageChange={(newStage) => onStageChange(app.scholarshipId, newStage)}
                        onRemove={() => onRemove(app.scholarshipId)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Active Column View */}
      <div className="md:hidden">
        {COLUMNS.filter((col) => col.id === mobileTab).map((col) => {
          const apps = getSortedAppsForStages(col.stages);
          const totalAmount = calculateTotalAmount(apps);

          return (
            <div key={col.id} className="flex flex-col gap-3">
              {totalAmount > 0 && (
                <div className="flex items-center justify-between px-1 text-xs text-ink-600">
                  <span>Total in {col.title}</span>
                  <span className="font-bold text-forest-900 font-display">{formatINR(totalAmount)}</span>
                </div>
              )}

              {apps.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-xl border border-dashed border-line bg-surface">
                  <p className="text-xs text-ink-500 font-medium">No scholarships in this stage</p>
                </div>
              ) : (
                apps.map((app) => {
                  const item = scholarshipsById[app.scholarshipId];
                  if (!item) return null;
                  return (
                    <TrackerCard
                      key={app.scholarshipId}
                      application={app}
                      scholarship={item.scholarship}
                      heldDocs={heldDocs}
                      deadlineIso={deadlines[app.scholarshipId]}
                      onStageChange={(newStage) => onStageChange(app.scholarshipId, newStage)}
                      onRemove={() => onRemove(app.scholarshipId)}
                    />
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
