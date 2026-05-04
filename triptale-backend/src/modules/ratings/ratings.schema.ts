import { z } from 'zod';

export const upsertRatingSchema = z.object({
  value: z.coerce.number().int().min(1).max(5),
});

export const tripIdParamSchema = z.object({
  tripId: z.coerce.number().int().positive(),
});
