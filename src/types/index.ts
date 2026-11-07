export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type Gender = 'Female' | 'Male' | 'Other';

export type Course =
  | 'Engineering'
  | 'Medical'
  | 'Arts & Science'
  | 'Commerce'
  | 'Law'
  | 'Management'
  | 'Other';

export type Level = 'School' | 'Undergraduate' | 'Postgraduate' | 'Diploma';

export type IncomeBracket =
  | 'under-2.5L'
  | '2.5L-5L'
  | '5L-8L'
  | 'above-8L'
  | 'unknown'; // unknown = "I don't have an income certificate yet"

export interface Profile {
  name: string;
  state: string;
  category: Category;
  gender: Gender;
  course: Course;
  level: Level;
  year: number; // year of study, 1-5
  marksPercent: number; // 0-100, last exam
  incomeBracket: IncomeBracket;
  hasDisability: boolean;
  firstGenerationLearner: boolean;
}

export type DocumentId =
  | 'aadhaar'
  | 'income-certificate'
  | 'caste-certificate'
  | 'marksheet'
  | 'bank-passbook'
  | 'admission-proof'
  | 'domicile-certificate'
  | 'disability-certificate'
  | 'passport-photo'
  | 'bonafide-certificate';

export interface DocumentType {
  id: DocumentId;
  label: string;
  hint: string;
}

export interface Eligibility {
  maxIncomeBracket?: IncomeBracket; // highest bracket allowed
  minMarks?: number;
  categories?: Category[]; // allowed categories
  genders?: Gender[];
  states?: string[]; // allowed states; omit = all India
  courses?: Course[];
  levels?: Level[];
  years?: number[]; // allowed years of study
  requiresDisability?: boolean;
  requiresFirstGen?: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerType: 'Government' | 'Private' | 'Foundation' | 'State';
  amount: number; // annual INR, illustrative
  shortDescription: string; // original wording, <= 140 chars
  plainSummary: string; // "Explain simply" text, 2-3 sentences, no jargon
  eligibility: Eligibility;
  requiredDocs: DocumentId[];
  howToApply: string[]; // 3-5 short steps
  deadlineInDays: number; // days from first app load; converted to a fixed ISO date once and persisted
  officialUrl: string; // generic provider homepage only; no deep links
  tags: string[];
}

export type MatchStatus = 'eligible' | 'almost' | 'not-eligible';
export type CriterionState = 'pass' | 'fail' | 'unverified';

export interface CriterionResult {
  key: keyof Eligibility;
  label: string; // "Family income up to ₹5L"
  state: CriterionState;
  detail: string; // "Your income: ₹2.5L–5L ✓" or "Needs 75%, you have 68%"
  closable: boolean; // can the student realistically fix this?
  nextStep?: string; // only for fail+closable or unverified
}

export interface MatchResult {
  scholarshipId: string;
  status: MatchStatus;
  criteria: CriterionResult[];
  failingCount: number;
  headline: string; // one-line reason shown on cards
  unlockStep?: string; // set when status === 'almost'
}

export type ApplicationStage =
  | 'saved'
  | 'preparing'
  | 'applied'
  | 'awarded'
  | 'rejected';

export interface Application {
  scholarshipId: string;
  stage: ApplicationStage;
  updatedAt: string; // ISO
  notes?: string;
}

export interface MoneySummary {
  eligibleTotal: number; // sum of amount where status === 'eligible'
  unlockableTotal: number; // sum of amount where status === 'almost'
  appliedTotal: number; // sum of amount where application stage is 'applied' | 'awarded'
  eligibleCount: number;
  almostCount: number;
  deadlinesSoon: number; // eligible or almost, not yet applied, deadline within 14 days
  missingDocsCount: number; // distinct documents required by eligible scholarships that the user does NOT hold
}

export interface FilterState {
  query: string;
  providerTypes: string[];
  minAmount: number;
  deadlineWithin: number | null;
  status: MatchStatus | 'all';
  sort: 'match' | 'amount' | 'deadline';
}
