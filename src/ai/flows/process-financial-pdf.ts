'use server';

/**
 * @fileOverview This file defines the Genkit flow for processing financial documents (PDFs) to extract transactions.
 *
 * It includes:
 * - `processFinancialPdf`: The main function that takes a PDF data URI and returns extracted transactions.
 * - `ProcessFinancialPdfInput`: The input schema for the flow.
 * - `ProcessFinancialPdfOutput`: The output schema for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string().describe("The transaction date in ISO 8601 format (YYYY-MM-DD). The current date is " + new Date().toISOString().split('T')[0]),
});

const ProcessFinancialPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A financial document (like a bank statement or invoice) as a PDF data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ProcessFinancialPdfInput = z.infer<typeof ProcessFinancialPdfInputSchema>;


const ProcessFinancialPdfOutputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('A list of financial transactions extracted from the document.'),
});
export type ProcessFinancialPdfOutput = z.infer<typeof ProcessFinancialPdfOutputSchema>;


export async function processFinancialPdf(input: ProcessFinancialPdfInput): Promise<ProcessFinancialPdfOutput> {
  return processFinancialPdfFlow(input);
}


const processFinancialPdfPrompt = ai.definePrompt({
  name: 'processFinancialPdfPrompt',
  input: {schema: ProcessFinancialPdfInputSchema},
  output: {schema: ProcessFinancialPdfOutputSchema},
  prompt: `You are an expert financial assistant. Your task is to meticulously analyze the provided financial document (PDF) and extract all transactions.

  Document:
  {{media url=pdfDataUri}}

  - Identify every transaction in the document.
  - For each transaction, determine if it is an 'income' or an 'expense'.
  - Extract the transaction date and format it as YYYY-MM-DD.
  - Determine a suitable category based on the transaction description (e.g., 'Salary', 'Groceries', 'Utilities', 'Rent').
  - Extract the description and the amount.
  - Return all extracted transactions in the 'transactions' array.
  - If the document is not a financial document or no transactions can be found, return an empty array.`,
});


const processFinancialPdfFlow = ai.defineFlow(
  {
    name: 'processFinancialPdfFlow',
    inputSchema: ProcessFinancialPdfInputSchema,
    outputSchema: ProcessFinancialPdfOutputSchema,
  },
  async (input) => {
    const {output} = await processFinancialPdfPrompt(input);
    return output!;
  }
);
