import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays } from 'date-fns';
import { SCHOLARSHIPS } from '../data/scholarships';
import {
  Application,
  ApplicationStage,
  DocumentId,
  FilterState,
  Profile,
} from '../types';

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  providerTypes: [],
  minAmount: 0,
  deadlineWithin: null,
  status: 'all',
  sort: 'match',
};

export const PRIYA_DEMO_PROFILE: Profile = {
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

interface AppState {
  profile: Profile | null;
  onboarded: boolean;
  heldDocs: DocumentId[];
  applications: Application[];
  deadlines: Record<string, string>;
  filters: FilterState;

  // Actions
  setProfile: (profile: Profile) => void;
  completeOnboarding: (profile: Profile) => void;
  toggleDoc: (docId: DocumentId) => void;
  setDocHeld: (docId: DocumentId, held: boolean) => void;
  saveScholarship: (scholarshipId: string, stage?: ApplicationStage) => void;
  setStage: (
    scholarshipId: string,
    stage: ApplicationStage,
    notes?: string,
  ) => void;
  removeApplication: (scholarshipId: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  loadDemoPersona: () => void;
  loadDemoNoIncomePersona: () => void;
  resetAll: () => void;
  ensureDeadlines: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      onboarded: false,
      heldDocs: [],
      applications: [],
      deadlines: {},
      filters: DEFAULT_FILTERS,

      ensureDeadlines: () => {
        const { deadlines } = get();
        const now = new Date();
        const updated: Record<string, string> = { ...deadlines };
        let hasChanges = false;

        for (const s of SCHOLARSHIPS) {
          if (!updated[s.id]) {
            updated[s.id] = addDays(now, s.deadlineInDays).toISOString();
            hasChanges = true;
          }
        }

        if (hasChanges) {
          set({ deadlines: updated });
        }
      },

      setProfile: (profile: Profile) => {
        set({ profile });
      },

      completeOnboarding: (profile: Profile) => {
        get().ensureDeadlines();
        set({ profile, onboarded: true });
      },

      toggleDoc: (docId: DocumentId) => {
        const { heldDocs } = get();
        const exists = heldDocs.includes(docId);
        set({
          heldDocs: exists
            ? heldDocs.filter((id) => id !== docId)
            : [...heldDocs, docId],
        });
      },

      setDocHeld: (docId: DocumentId, held: boolean) => {
        const { heldDocs } = get();
        const exists = heldDocs.includes(docId);
        if (held && !exists) {
          set({ heldDocs: [...heldDocs, docId] });
        } else if (!held && exists) {
          set({ heldDocs: heldDocs.filter((id) => id !== docId) });
        }
      },

      saveScholarship: (scholarshipId: string, stage: ApplicationStage = 'saved') => {
        const { applications } = get();
        const existing = applications.find(
          (a) => a.scholarshipId === scholarshipId,
        );
        const now = new Date().toISOString();

        if (existing) {
          set({
            applications: applications.map((a) =>
              a.scholarshipId === scholarshipId
                ? { ...a, stage, updatedAt: now }
                : a,
            ),
          });
        } else {
          set({
            applications: [
              ...applications,
              { scholarshipId, stage, updatedAt: now },
            ],
          });
        }
      },

      setStage: (
        scholarshipId: string,
        stage: ApplicationStage,
        notes?: string,
      ) => {
        const { applications } = get();
        const existing = applications.find(
          (a) => a.scholarshipId === scholarshipId,
        );
        const now = new Date().toISOString();

        if (existing) {
          set({
            applications: applications.map((a) =>
              a.scholarshipId === scholarshipId
                ? {
                    ...a,
                    stage,
                    updatedAt: now,
                    notes: notes !== undefined ? notes : a.notes,
                  }
                : a,
            ),
          });
        } else {
          set({
            applications: [
              ...applications,
              { scholarshipId, stage, updatedAt: now, notes },
            ],
          });
        }
      },

      removeApplication: (scholarshipId: string) => {
        const { applications } = get();
        set({
          applications: applications.filter(
            (a) => a.scholarshipId !== scholarshipId,
          ),
        });
      },

      setFilters: (newFilters: Partial<FilterState>) => {
        set({
          filters: { ...get().filters, ...newFilters },
        });
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
      },

      loadDemoPersona: () => {
        get().ensureDeadlines();
        const now = new Date().toISOString();
        set({
          profile: { ...PRIYA_DEMO_PROFILE },
          onboarded: true,
          heldDocs: ['aadhaar', 'marksheet'],
          applications: [
            {
              scholarshipId: 'maha-ebc-eng',
              stage: 'saved',
              updatedAt: now,
              notes: 'Checked fee structure with college admin',
            },
            {
              scholarshipId: 'pragati-girls-tech',
              stage: 'preparing',
              updatedAt: now,
              notes: 'Gathering college bonafide certificate',
            },
          ],
        });
      },

      loadDemoNoIncomePersona: () => {
        get().ensureDeadlines();
        const now = new Date().toISOString();
        set({
          profile: {
            ...PRIYA_DEMO_PROFILE,
            incomeBracket: 'unknown',
          },
          onboarded: true,
          heldDocs: ['aadhaar', 'marksheet'],
          applications: [
            {
              scholarshipId: 'pragati-girls-tech',
              stage: 'saved',
              updatedAt: now,
            },
          ],
        });
      },

      resetAll: () => {
        set({
          profile: null,
          onboarded: false,
          heldDocs: [],
          applications: [],
          filters: DEFAULT_FILTERS,
        });
      },
    }),
    {
      name: 'grantly-v1',
    },
  ),
);
