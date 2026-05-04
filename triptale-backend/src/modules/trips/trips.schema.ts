import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().max(5000).optional().default(''),
  location: z.string().max(200).optional().default(''),
  region: z.string().max(120).optional(),
  country: z.string().max(80).optional(),
  coverPhoto: z.string().url().optional(),
  budget: z.number().nonnegative().optional(),
  categoryId: z.number().int().positive(),
});

export const updateTripSchema = createTripSchema.partial();

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listTripsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().trim().optional(),
  location: z.string().trim().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  categorySlug: z.string().trim().optional(),
  userId: z.coerce.number().int().positive().optional(),
  username: z.string().trim().optional(),
  minBudget: z.coerce.number().nonnegative().optional(),
  maxBudget: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['recent', 'popular', 'rating', 'budgetAsc', 'budgetDesc']).default('recent'),
});

export type ListTripsQuery = z.infer<typeof listTripsSchema>;
