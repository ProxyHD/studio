// routine-suggestions.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating personalized routine suggestions using AI.
 *
 * It includes:
 * - `getRoutineSuggestions`: A function that takes user data and returns personalized routine suggestions.
 * - `RoutineSuggestionsInput`: The input type for the `getRoutineSuggestions` function.
 * - `RoutineSuggestionsOutput`: The output type for the `getRoutineSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoutineSuggestionsInputSchema = z.object({
  userData: z.string().describe('A description of the user, their current habits, and their goals.'),
});
export type RoutineSuggestionsInput = z.infer<typeof RoutineSuggestionsInputSchema>;

const RoutineSuggestionsOutputSchema = z.object({
  routineSuggestions: z.string().describe('Personalized routine suggestions based on the user data.'),
});
export type RoutineSuggestionsOutput = z.infer<typeof RoutineSuggestionsOutputSchema>;

export async function getRoutineSuggestions(input: RoutineSuggestionsInput): Promise<RoutineSuggestionsOutput> {
  return routineSuggestionsFlow(input);
}

const routineSuggestionsPrompt = ai.definePrompt({
  name: 'routineSuggestionsPrompt',
  input: {schema: RoutineSuggestionsInputSchema},
  output: {schema: RoutineSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides personalized routine suggestions based on user data.

  User Data: {{{userData}}}

  Please provide routine suggestions that will help the user improve their daily habits and optimize their schedule.
  The suggestions should be actionable and easy to follow.
  Do not include any introductory or concluding remarks. Focus on the routine suggestions only.`,
});

const routineSuggestionsFlow = ai.defineFlow(
  {
    name: 'routineSuggestionsFlow',
    inputSchema: RoutineSuggestionsInputSchema,
    outputSchema: RoutineSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await routineSuggestionsPrompt(input);
    return output!;
  }
);
