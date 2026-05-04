import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as controller from './follows.controller';
import { userIdParamSchema } from './follows.schema';

const router = Router();

/**
 * @openapi
 * /api/users/{userId}/follow:
 *   post:
 *     tags: [Follows]
 *     summary: Follow a user
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [Follows]
 *     summary: Unfollow a user
 *     security: [ { bearerAuth: [] } ]
 *   get:
 *     tags: [Follows]
 *     summary: Check if current user follows this user
 *     security: [ { bearerAuth: [] } ]
 * /api/users/{userId}/followers:
 *   get:
 *     tags: [Follows]
 *     summary: List followers of a user
 * /api/users/{userId}/following:
 *   get:
 *     tags: [Follows]
 *     summary: List users that a user follows
 */
router.post(
  '/users/:userId/follow',
  requireAuth,
  validate(userIdParamSchema, 'params'),
  asyncHandler(controller.follow),
);
router.delete(
  '/users/:userId/follow',
  requireAuth,
  validate(userIdParamSchema, 'params'),
  asyncHandler(controller.unfollow),
);
router.get(
  '/users/:userId/follow',
  requireAuth,
  validate(userIdParamSchema, 'params'),
  asyncHandler(controller.status),
);
router.get(
  '/users/:userId/followers',
  validate(userIdParamSchema, 'params'),
  asyncHandler(controller.followers),
);
router.get(
  '/users/:userId/following',
  validate(userIdParamSchema, 'params'),
  asyncHandler(controller.following),
);

export default router;
