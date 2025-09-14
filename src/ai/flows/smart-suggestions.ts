'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating personalized routine suggestions using AI.
 *
 * It includes:
 * - `getSmartSuggestions`: A function that takes user data and returns personalized routine suggestions and creates items.
 * - `SmartSuggestionsInput`: The input type for the `getSmartSuggestions` function.
 * - `SmartSuggestionsOutput`: The output type for the `getSmartSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSuggestionsInputSchema = z.object({
  userData: z.string().describe('A description of the user, their current habits, and their goals.'),
  locale: z.enum(['pt-BR', 'en-US']).describe('The language to generate the response in.'),
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

const EventSchema = z.object({
    title: z.string(),
    date: z.string().describe("The event date in ISO 8601 format (YYYY-MM-DD). The current date is " + new Date().toISOString().split('T')[0]),
    startTime: z.string().optional().describe("The start time in 24-hour format (HH:MM)."),
    endTime: z.string().optional().describe("The end time in 24-hour format (HH:MM)."),
    location: z.string().optional(),
});

const ScheduleItemSchema = z.object({
    title: z.string(),
    dayOfWeek: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
    startTime: z.string().describe("The start time in 24-hour format (HH:MM)."),
    endTime: z.string().describe("The end time in 24-hour format (HH:MM)."),
    location: z.string().optional().describe("The location or room for the schedule item."),
});

const TransactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    description: z.string(),
    amount: z.number(),
    category: z.string(),
    date: z.string().describe("The transaction date in ISO 8601 format (YYYY-MM-DD). The current date is " + new Date().toISOString().split('T')[0]),
});

const SmartSuggestionsOutputSchema = z.object({
  suggestionText: z.string().describe('Personalized suggestions and comments based on the user data.'),
  createdTasks: z.array(TaskSchema).optional().describe('List of tasks to be created based on user request.'),
  createdHabits: z.array(HabitSchema).optional().describe('List of habits to be created based on user request.'),
  createdNotes: z.array(NoteSchema).optional().describe('List of notes to be created based on user request.'),
  createdEvents: z.array(EventSchema).optional().describe('List of calendar events to be created based on user request.'),
  createdScheduleItems: z.array(ScheduleItemSchema).optional().describe('List of weekly schedule items to be created based on user request.'),
  createdTransactions: z.array(TransactionSchema).optional().describe('List of financial transactions to be created based on user request.'),
});
export type SmartSuggestionsOutput = z.infer<typeof SmartSuggestionsOutputSchema>;

export async function getSmartSuggestions(input: SmartSuggestionsInput): Promise<SmartSuggestionsOutput> {
  return smartSuggestionsFlow(input);
}

const smartSuggestionsPrompt = ai.definePrompt({
  name: 'smartSuggestionsPrompt',
  input: {schema: SmartSuggestionsInputSchema},
  output: {schema: SmartSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides personalized suggestions and helps create tasks, habits, notes, events, schedule items, and financial transactions.

  IMPORTANT: You must generate all text in the following language: {{{locale}}}.
  The current date is ${new Date().toISOString()}.

  User Data: {{{userData}}}

  - Analyze the user's request.
  - If the user asks for suggestions, provide actionable and easy-to-follow ideas in the suggestionText field.
  - If the user asks to create something, populate the corresponding array (createdTasks, createdHabits, createdNotes, createdEvents, createdScheduleItems, createdTransactions).
  - Always provide a friendly confirmation or suggestion in the suggestionText field, even when creating items. For example, if a task is created, you could say "I've created that task for you!".
  - For tasks, assume 'medium' priority unless specified otherwise.
  - For habits, if no days are specified, assume it's for every day of the week.
  - For notes, use the user's prompt to generate a title and content.
  - For events and transactions, infer the date from relative terms like "today", "tomorrow", or specific dates. Always return dates in YYYY-MM-DD format.
  - For transactions, correctly identify if it is an 'income' or 'expense'. Infer the category from the description.
  - For weekly schedule items, correctly identify the day of the week.
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
