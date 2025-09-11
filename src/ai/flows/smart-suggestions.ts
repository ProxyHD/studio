'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating personalized routine suggestions using AI.
 *
 * It includes:
 * - `getSmartSuggestions`: A function that takes user data and returns personalized routine suggestions.
 * - `SmartSuggestionsInput`: The input type for the `getSmartSuggestions` function.
 * - `SmartSuggestionsOutput`: The output type for the `getSmartSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Task, Habit, Note, DayOfWeek } from '@/lib/types';

const SmartSuggestionsInputSchema = z.object({
  userData: z.string().describe('A description of the user, their current habits, and their goals.'),
});
export type SmartSuggestionsInput = z.infer<typeof SmartSuggestionsInputSchema>;

const TaskSchema = z.object({
  title: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
});

const HabitSchema = z.object({
    name: z.string(),
    days: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])),
});

const NoteSchema = z.object({
    title: z.string(),
    content: z.string(),
});

const SmartSuggestionsOutputSchema = z.object({
  suggestionText: z.string().describe('Personalized suggestions and comments based on the user data.'),
  createdTasks: z.array(TaskSchema).optional().describe('List of tasks to be created based on user request.'),
  createdHabits: z.array(HabitSchema).optional().describe('List of habits to be created based on user request.'),
  createdNotes: z.array(NoteSchema).optional().describe('List of notes to be created based on user request.'),
});
export type SmartSuggestionsOutput = z.infer<typeof SmartSuggestionsOutputSchema>;

export async function getSmartSuggestions(input: SmartSuggestionsInput): Promise<SmartSuggestionsOutput> {
  return smartSuggestionsFlow(input);
}

const smartSuggestionsPrompt = ai.definePrompt({
  name: 'smartSuggestionsPrompt',
  input: {schema: SmartSuggestionsInputSchema},
  output: {schema: SmartSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides personalized suggestions and helps create tasks, habits, and notes.

  User Data: {{{userData}}}

  - Analyze the user's request.
  - If the user asks for suggestions, provide actionable and easy-to-follow ideas in the suggestionText field.
  - If the user asks to create something (e.g., "create a task to buy milk", "create a habit to run every day", "create a note about my project idea"), populate the corresponding array (createdTasks, createdHabits, createdNotes).
  - Always provide a friendly confirmation or suggestion in the suggestionText field, even when creating items. For example, if a task is created, you could say "I've created that task for you!".
  - For tasks, assume 'medium' priority unless specified otherwise.
  - For habits, if no days are specified, assume it's for every day of the week.
  - For notes, use the user's prompt to generate a title and content.
  - Do not include any introductory or concluding remarks not relevant to the direct response.`,
});

const smartSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSuggestionsFlow',
    inputSchema: SmartSuggestionsInputSchema,
    outputSchema: SmartSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await smartSuggestionsPrompt(input);
    return output!;
  }
);
