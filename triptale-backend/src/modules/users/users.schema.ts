import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/).optional(),
  fullName: z.string().min(2).max(80).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  profilePicture: z.string().max(2000).nullable().optional(),
  password: z.string().min(6).max(100).optional(),
});

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
