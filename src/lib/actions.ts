'use server';
import { gearHealthAnalyzer, type GearHealthAnalyzerInput } from '@/ai/flows/gear-health-analyzer';

export async function analyzeGear(data: GearHealthAnalyzerInput) {
  // In a real app, you would add user authentication checks here.
  try {
    const result = await gearHealthAnalyzer(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing gear:', error);
    // It's better to return a generic error message to the client.
    return { success: false, error: 'An unexpected error occurred while analyzing the gear. Please try again later.' };
  }
}
