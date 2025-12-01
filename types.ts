export type UsageTypeKey = 'draft' | 'coauthor' | 'writing-support' | 'ideation' | 'analysis' | 'review' | 'other';

export interface Prompt {
  id: string;
  description: string;
}

export interface ReviewTypes {
  factual: boolean;
  technical: boolean;
  ethical: boolean;
  style: boolean;
}

export interface HumanReview {
  performed: boolean;
  types: ReviewTypes;
  reviewerRole: string;
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
  usageTypes: UsageTypeKey[]; // Changed from single string to array
  customUsageType: string;
  aiTool: AITool;
  specificPurpose: string;
  prompts: Prompt[];
  contentUseModes: string[];
  contentUseContext: string;
  humanReview: HumanReview;
}

export interface ChecklistItem {
  id: string;
  q: string;
  suggests: UsageTypeKey;
  priority: number; // Higher number means higher precedence/impact
}

export interface UsageOption {
  value: UsageTypeKey;
  label: string;
  hint: string;
  examples: string[]; // Added specific examples
}