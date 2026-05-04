import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as controller from './users.controller';
import { updateProfileSchema, userIdParamSchema } from './users.schema';

const router = Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user with stats
 *     security: [ { bearerAuth: [] } ]
 *   patch:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [Users]
 *     summary: Delete current user account
 *     security: [ { bearerAuth: [] } ]
 */
router.get('/me', requireAuth, asyncHandler(controller.me));
router.patch('/me', requireAuth, validate(updateProfileSchema), asyncHandler(controller.updateMe));
router.delete('/me', requireAuth, asyncHandler(controller.deleteMe));

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user public profile
 * /api/users/{id}/trips:
 *   get:
 *     tags: [Users]
 *     summary: List trips owned by a user
 */
router.get('/:id', validate(userIdParamSchema, 'params'), asyncHandler(controller.getById));
router.get('/:id/trips', validate(userIdParamSchema, 'params'), asyncHandler(controller.tripsByUser));

export default router;
