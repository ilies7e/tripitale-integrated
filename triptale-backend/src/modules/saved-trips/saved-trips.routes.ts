import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as controller from './saved-trips.controller';
import {
  createSavedTripSchema,
  idParamSchema,
  tripIdParamSchema,
  updateSavedTripSchema,
} from './saved-trips.schema';

const router = Router();

/**
 * @openapi
 * /api/saved-trips:
 *   get:
 *     tags: [SavedTrips]
 *     summary: List the current user's saved trips
 *     security: [ { bearerAuth: [] } ]
 *   post:
 *     tags: [SavedTrips]
 *     summary: Save a trip (with optional notes/priority/pinned/visited/visitDate/comment); idempotent
 *     security: [ { bearerAuth: [] } ]
 * /api/saved-trips/{id}:
 *   patch:
 *     tags: [SavedTrips]
 *     summary: Update a saved trip (pinned, visited, visitDate, comment, notes, priority)
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [SavedTrips]
 *     security: [ { bearerAuth: [] } ]
 * /api/saved-trips/by-trip/{tripId}:
 *   patch:
 *     tags: [SavedTrips]
 *     summary: Upsert a saved trip by tripId (convenience)
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [SavedTrips]
 *     summary: Unsave by tripId (convenience)
 *     security: [ { bearerAuth: [] } ]
 *   get:
 *     tags: [SavedTrips]
 *     summary: Check if the current user has saved a trip
 *     security: [ { bearerAuth: [] } ]
 */
router.get('/', requireAuth, asyncHandler(controller.list));
router.post('/', requireAuth, validate(createSavedTripSchema), asyncHandler(controller.create));
router.patch(
  '/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  validate(updateSavedTripSchema),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  asyncHandler(controller.remove),
);
router.get(
  '/by-trip/:tripId',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.isSaved),
);
router.patch(
  '/by-trip/:tripId',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  validate(updateSavedTripSchema),
  asyncHandler(controller.updateByTripId),
);
router.delete(
  '/by-trip/:tripId',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.removeByTripId),
);

export default router;
