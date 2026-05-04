import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth, optionalAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as controller from './ratings.controller';
import { tripIdParamSchema, upsertRatingSchema } from './ratings.schema';

const router = Router();

/**
 * @openapi
 * /api/trips/{tripId}/ratings:
 *   get:
 *     tags: [Ratings]
 *     summary: Get aggregated ratings for a trip
 *   post:
 *     tags: [Ratings]
 *     summary: Create or update the current user's rating (1-5)
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [Ratings]
 *     summary: Remove the current user's rating
 *     security: [ { bearerAuth: [] } ]
 * /api/trips/{tripId}/ratings/me:
 *   get:
 *     tags: [Ratings]
 *     summary: Get the current user's rating for the trip
 *     security: [ { bearerAuth: [] } ]
 */
router.get(
  '/trips/:tripId/ratings',
  optionalAuth,
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.summary),
);
router.post(
  '/trips/:tripId/ratings',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  validate(upsertRatingSchema),
  asyncHandler(controller.upsert),
);
router.delete(
  '/trips/:tripId/ratings',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.remove),
);
router.get(
  '/trips/:tripId/ratings/me',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.myRating),
);

export default router;
