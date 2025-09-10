'use server';

/**
 * @fileOverview An AI agent that provides intelligent organizational suggestions.
 *
 * - getOrganizationSuggestions - A function that returns organizational suggestions for tasks and notes.
 * - GetOrganizationSuggestionsInput - The input type for the getOrganizationSuggestions function.
 * - GetOrganizationSuggestionsOutput - The return type for the getOrganizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetOrganizationSuggestionsInputSchema = z.object({
  tasks: z.array(z.string()).describe('A list of tasks.'),
  notes: z.array(z.string()).describe('A list of notes.'),
});
export type GetOrganizationSuggestionsInput = z.infer<typeof GetOrganizationSuggestionsInputSchema>;

const GetOrganizationSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of intelligent organizational suggestions.'),
});
export type GetOrganizationSuggestionsOutput = z.infer<typeof GetOrganizationSuggestionsOutputSchema>;

export async function getOrganizationSuggestions(
  input: GetOrganizationSuggestionsInput
): Promise<GetOrganizationSuggestionsOutput> {
  return getOrganizationSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getOrganizationSuggestionsPrompt',
  input: {schema: GetOrganizationSuggestionsInputSchema},
  output: {schema: GetOrganizationSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide intelligent organizational suggestions for tasks and notes.

  Based on the following tasks and notes, provide a list of suggestions on how to organize them effectively.

  Tasks:
  {{#each tasks}}- {{{this}}}\n{{/each}}

  Notes:
  {{#each notes}}- {{{this}}}\n{{/each}}

  Suggestions:
  `, // Keep the backticks for multiline string.
});

const getOrganizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'getOrganizationSuggestionsFlow',
    inputSchema: GetOrganizationSuggestionsInputSchema,
    outputSchema: GetOrganizationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
