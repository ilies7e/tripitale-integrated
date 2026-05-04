import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
