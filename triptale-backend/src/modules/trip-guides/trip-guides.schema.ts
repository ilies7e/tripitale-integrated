import { z } from 'zod';

export const guideTypeEnum = z.enum(['budget', 'mustvisit', 'food', 'warnings', 'extra']);

export const guideSchema = z.object({
  type: guideTypeEnum,
  label: z.string().min(1).max(80),
  icon: z.string().max(8).optional(),
  text: z.string().max(5000).default(''),
  locations: z.array(z.string().max(200)).default([]),
});

export const guideUpdateSchema = z.object({
  label: z.string().min(1).max(80).optional(),
  icon: z.string().max(8).optional(),
  text: z.string().max(5000).optional(),
  locations: z.array(z.string().max(200)).optional(),
});

export const bulkGuidesSchema = z.object({
  guides: z.array(guideSchema).max(10),
});

export const tripIdParamSchema = z.object({
  tripId: z.coerce.number().int().positive(),
});

export const tripAndGuideIdSchema = z.object({
  tripId: z.coerce.number().int().positive(),
  guideId: z.coerce.number().int().positive(),
});
