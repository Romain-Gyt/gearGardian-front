'use server';

/**
 * @fileOverview Analyzes the health of climbing gear using AI, providing notifications for proactive equipment replacement.
 *
 * - gearHealthAnalyzer - A function that analyzes gear health and determines if a notification is needed.
 * - GearHealthAnalyzerInput - The input type for the gearHealthAnalyzer function.
 * - GearHealthAnalyzerOutput - The return type for the gearHealthAnalyzer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GearHealthAnalyzerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the climbing gear, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the climbing gear, including usage history.'),
  manufacturerData: z.string().describe('Data from the manufacturer about the gear.'),
});
export type GearHealthAnalyzerInput = z.infer<typeof GearHealthAnalyzerInputSchema>;

const GearHealthAnalyzerOutputSchema = z.object({
  needsReplacement: z.boolean().describe('Whether the gear needs to be replaced.'),
  reason: z.string().describe('The reason why the gear needs to be replaced.'),
  confidence: z.number().describe('The confidence level (0-1) of the analysis.'),
});
export type GearHealthAnalyzerOutput = z.infer<typeof GearHealthAnalyzerOutputSchema>;

export async function gearHealthAnalyzer(input: GearHealthAnalyzerInput): Promise<GearHealthAnalyzerOutput> {
  return gearHealthAnalyzerFlow(input);
}

const gearHealthAnalyzerPrompt = ai.definePrompt({
  name: 'gearHealthAnalyzerPrompt',
  input: {schema: GearHealthAnalyzerInputSchema},
  output: {schema: GearHealthAnalyzerOutputSchema},
  prompt: `You are an AI assistant that analyzes the health of climbing gear and determines if it needs replacement.\n\nAnalyze the following information to determine if the gear needs to be replaced. Provide a confidence level (0-1) for your analysis.\n\nDescription: {{{description}}}\nPhoto: {{media url=photoDataUri}}\nManufacturer Data: {{{manufacturerData}}}\n\nBased on the analysis, determine if the gear needs to be replaced and provide a reason.`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const gearHealthAnalyzerFlow = ai.defineFlow(
  {
    name: 'gearHealthAnalyzerFlow',
    inputSchema: GearHealthAnalyzerInputSchema,
    outputSchema: GearHealthAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await gearHealthAnalyzerPrompt(input);
    return output!;
  }
);
