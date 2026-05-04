import { z } from 'zod';

export const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive(),
});
