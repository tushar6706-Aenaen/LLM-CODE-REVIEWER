import { z } from 'zod';

// Schema for analysis query parameters
export const getAnalysesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

// Schema for analysis ID parameter
export const analysisIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid analysis ID'),
  }),
});

