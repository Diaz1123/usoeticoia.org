
export type UsageTypeKey = 'draft' | 'coauthor' | 'writing-support' | 'ideation' | 'analysis' | 'review' | 'translation' | 'coding' | 'other';

export interface Prompt {
  id: string;
  description: string;
}

// 7 Levels of Human Intervention
export type HumanReviewLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface HumanReview {
  level: HumanReviewLevel;
  reviewerRole: string;
  reviewerName: string; // Added for academic validation
}

export interface AITool {
  name: string;
  version: string;
  provider: string;
  date: {
    month: number;
    year: number;
  };
}

export interface DeclarationState {
  declarationId: string; // Unique ID for this session
  selectedChecklistIds: string[]; // For traceability of Step 1
  usageTypes: UsageTypeKey[];
  customUsageType: string;
  aiTool: AITool;
  specificPurpose: string;
  prompts: Prompt[];
  contentUseModes: string[];
  customContentUseMode: string; 
  contentUseContext: string;
  humanReview: HumanReview;
  license: string; // New: Creative Commons License
}

export interface ChecklistItem {
  id: string;
  q: string;
  suggests: UsageTypeKey;
  priority: number;
}

export interface UsageOption {
  value: UsageTypeKey;
  label: string;
  hint: string;
  examples: string[];
}

export interface ReviewLevelOption {
  level: HumanReviewLevel;
  label: string;
  description: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  data: Partial<DeclarationState>;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}
