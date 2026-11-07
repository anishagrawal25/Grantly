import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useMatches } from '../hooks/useMatches';
import { RoadmapStepper } from '../components/tracker/RoadmapStepper';
import { DeadlineRadar, RadarFilter } from '../components/tracker/DeadlineRadar';
import { KanbanBoard } from '../components/tracker/KanbanBoard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { ApplicationStage } from '../types';

export default function Tracker() {
  const navigate = useNavigate();
  const applications = useAppStore((state) => state.applications);
  const heldDocs = useAppStore((state) => state.heldDocs);
  const deadlines = useAppStore((state) => state.deadlines);
  const setStage = useAppStore((state) => state.setStage);
  const removeApplication = useAppStore((state) => state.removeApplication);
  const { byId } = useMatches();

  const [radarFilter, setRadarFilter] = useState<RadarFilter>('all');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

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

  const handleStageChange = (scholarshipId: string, stage: ApplicationStage) => {
    setStage(scholarshipId, stage);

    const scholarshipName = byId[scholarshipId]?.scholarship.name || 'Scholarship';

    switch (stage) {
      case 'applied':
        showToast({
          tone: 'success',
          title: 'Marked as applied 🎉',
          message: `${scholarshipName} submitted! Keep following up on portal notifications.`,
        });
        break;
      case 'awarded':
        showToast({
          tone: 'success',
          title: 'Congratulations! 🏆',
          message: `${scholarshipName} awarded! Funding is counted in your Applied total.`,
        });
        break;
      case 'preparing':
        showToast({
          tone: 'info',
          title: 'Moved to Preparing',
          message: 'Gather and verify your documents before submitting.',
        });
        break;
      case 'saved':
        showToast({
          tone: 'info',
          title: 'Moved to Saved',
          message: `${scholarshipName} kept in your saved list.`,
        });
        break;
      case 'rejected':
        showToast({
          tone: 'warning',
          title: 'Application Closed',
          message: 'Opportunity marked as not selected. Keep going—more options are open!',
        });
        break;
    }
  };

  const handleRemove = (scholarshipId: string) => {
    removeApplication(scholarshipId);
    showToast({
      tone: 'info',
      title: 'Application Removed',
      message: 'Removed from your application tracker.',
    });
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
        <>
          {/* Deadline Radar */}
          <DeadlineRadar
            applications={applications}
            deadlines={deadlines}
            scholarshipsById={byId}
            activeFilter={radarFilter}
            onSelectFilter={setRadarFilter}
          />

          {/* Kanban Board */}
          <KanbanBoard
            applications={applications}
            scholarshipsById={byId}
            deadlines={deadlines}
            heldDocs={heldDocs}
            radarFilter={radarFilter}
            onStageChange={handleStageChange}
            onRemove={handleRemove}
          />
        </>
      )}

      {/* Toast Notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
