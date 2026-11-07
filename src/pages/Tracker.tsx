import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useMatches } from '../hooks/useMatches';
import { RoadmapStepper } from '../components/tracker/RoadmapStepper';
import { KanbanBoard } from '../components/tracker/KanbanBoard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { ApplicationStage } from '../types';

export default function Tracker() {
  const navigate = useNavigate();
  const applications = useAppStore((state) => state.applications);
  const heldDocs = useAppStore((state) => state.heldDocs);
  const deadlines = useAppStore((state) => state.deadlines);
  const setStage = useAppStore((state) => state.setStage);
  const removeApplication = useAppStore((state) => state.removeApplication);
  const { byId } = useMatches();

  const handleStageChange = (scholarshipId: string, stage: ApplicationStage) => {
    setStage(scholarshipId, stage);
  };

  const handleRemove = (scholarshipId: string) => {
    removeApplication(scholarshipId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900 tracking-tight">
              Application Tracker
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
              {applications.length} tracked
            </span>
          </div>
          <p className="text-sm text-ink-600 mt-1">
            Track deadlines, organize documents, and steer your applications to completion.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/discover')}
          leftIcon={<Compass className="w-4 h-4 text-brand-600" />}
          className="self-start sm:self-auto"
        >
          <span>Find more scholarships</span>
        </Button>
      </div>

      {/* Roadmap Stepper */}
      <RoadmapStepper applications={applications} />

      {/* Main Kanban Content or Empty State */}
      {applications.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-line p-8 sm:p-12 shadow-card">
          <EmptyState
            illustration="search"
            title="No scholarships tracked yet"
            description="Explore scholarships tailored to your profile and save them to plan your application journey, monitor documents, and stay on top of deadlines."
            action={
              <Button onClick={() => navigate('/discover')}>
                Discover Scholarships
              </Button>
            }
          />
        </div>
      ) : (
        <KanbanBoard
          applications={applications}
          scholarshipsById={byId}
          deadlines={deadlines}
          heldDocs={heldDocs}
          onStageChange={handleStageChange}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
