import { z } from 'zod';

export const createSavedTripSchema = z.object({
  tripId: z.number().int().positive(),
  notes: z.string().max(2000).optional(),
  priority: z.number().int().min(0).max(10).default(0),
  pinned: z.boolean().optional(),
  visited: z.boolean().optional(),
  visitDate: z.string().datetime().nullable().optional(),
  comment: z.string().max(2000).nullable().optional(),
});

export const updateSavedTripSchema = z.object({
  notes: z.string().max(2000).nullable().optional(),
  priority: z.number().int().min(0).max(10).optional(),
  pinned: z.boolean().optional(),
  visited: z.boolean().optional(),
  visitDate: z.string().datetime().nullable().optional(),
  comment: z.string().max(2000).nullable().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const tripIdParamSchema = z.object({
  tripId: z.coerce.number().int().positive(),
});
