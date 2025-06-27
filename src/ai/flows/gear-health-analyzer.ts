'use server';
/**
 * @fileOverview Un agent IA pour analyser la santé des équipements d'escalade.
 *
 * - analyzeGearHealth - Une fonction qui gère le processus d'analyse de l'équipement.
 * - GearHealthInput - Le type d'entrée pour la fonction analyzeGearHealth.
 * - GearHealthOutput - Le type de retour pour la fonction analyzeGearHealth.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GearHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Une photo d'un équipement, sous forme de data URI incluant un type MIME et un encodage Base64. Format attendu : 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe("La description de l'équipement, incluant l'usure observée."),
  manufacturerData: z.string().describe("Les données du fabricant concernant l'équipement (marque, modèle, recommandations)."),
});
export type GearHealthInput = z.infer<typeof GearHealthInputSchema>;

const GearHealthOutputSchema = z.object({
    isSafe: z.boolean().describe("Indique si l'équipement est considéré comme sûr pour l'utilisation."),
    confidence: z.number().min(0).max(1).describe("Score de confiance de l'analyse, de 0 à 1."),
    reasoning: z.string().describe("Explication détaillée de l'analyse, point par point."),
    recommendations: z.string().describe("Actions recommandées (ex: nettoyage, inspection plus poussée, mise au rebut)."),
});
export type GearHealthOutput = z.infer<typeof GearHealthOutputSchema>;

export async function analyzeGearHealth(input: GearHealthInput): Promise<GearHealthOutput> {
  return gearHealthAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gearHealthPrompt',
  input: {schema: GearHealthInputSchema},
  output: {schema: GearHealthOutputSchema},
  prompt: `Vous êtes un expert en sécurité des Équipements de Protection Individuelle (EPI) pour l'escalade, certifié par les plus grandes marques comme Petzl et Black Diamond.
Votre mission est d'analyser l'état d'un équipement d'escalade à partir d'une photo et d'une description.

Analysez l'image et les textes fournis pour évaluer l'état de l'équipement. Soyez très prudent et privilégiez toujours la sécurité.

1.  **Évaluation de la sécurité (isSafe):** Déterminez si l'équipement semble sûr pour une utilisation. En cas de doute, considérez-le comme non sûr.
2.  **Confiance (confidence):** Donnez un score de confiance à votre évaluation. Si l'image est floue ou si les informations sont insuffisantes, le score doit être bas.
3.  **Raisonnement (reasoning):** Fournissez une analyse détaillée, point par point, des éléments visibles sur la photo et décrits dans le texte. Mentionnez les points d'usure, les dommages potentiels (même mineurs) et les zones qui semblent en bon état.
4.  **Recommandations (recommendations):** Donnez des recommandations claires. Si l'équipement est jugé dangereux, indiquez "Mise au rebut immédiate recommandée". Sinon, suggérez des actions comme "Nettoyage nécessaire", "Inspection tactile approfondie requise" ou "Continuez à surveiller ce point d'usure".

Description de l'équipement par l'utilisateur: {{{description}}}
Données du fabricant: {{{manufacturerData}}}
Photo: {{media url=photoDataUri}}`,
});

const gearHealthAnalyzerFlow = ai.defineFlow(
  {
    name: 'gearHealthAnalyzerFlow',
    inputSchema: GearHealthInputSchema,
    outputSchema: GearHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
