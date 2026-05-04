import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const tripIdParamSchema = z.object({
  tripId: z.coerce.number().int().positive(),
});

export const captionSchema = z.object({
  caption: z.string().max(500).optional(),
});
