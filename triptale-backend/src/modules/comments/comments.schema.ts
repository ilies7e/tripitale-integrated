import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const updateCommentSchema = createCommentSchema;

export const tripIdParamSchema = z.object({
  tripId: z.coerce.number().int().positive(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
