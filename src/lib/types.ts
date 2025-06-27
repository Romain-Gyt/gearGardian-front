import type { GearHealthAnalyzerOutput } from '@/ai/flows/gear-health-analyzer';

export interface Equipment {
  id: string;
  name: string;
  photoUrl: string;
  photoDataUri?: string;
  photoAiHint: string;
  purchaseDate: Date;
  lifespanYears: number;
  description: string;
  manufacturerData: string;
  healthAnalysis?: GearHealthAnalyzerOutput & { analyzedAt: Date };
}
