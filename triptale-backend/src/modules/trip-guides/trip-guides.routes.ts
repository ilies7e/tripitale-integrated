import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as controller from './trip-guides.controller';
import {
  bulkGuidesSchema,
  guideSchema,
  guideUpdateSchema,
  tripAndGuideIdSchema,
  tripIdParamSchema,
} from './trip-guides.schema';

const router = Router();

/**
 * @openapi
 * /api/trips/{tripId}/guides:
 *   get:
 *     tags: [TripGuides]
 *     summary: List guides for a trip (budget, mustvisit, food, warnings, extra)
 *   post:
 *     tags: [TripGuides]
 *     summary: Upsert a guide for a trip by type
 *     security: [ { bearerAuth: [] } ]
 *   put:
 *     tags: [TripGuides]
 *     summary: Replace all guides for a trip atomically
 *     security: [ { bearerAuth: [] } ]
 * /api/trips/{tripId}/guides/{guideId}:
 *   patch:
 *     tags: [TripGuides]
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [TripGuides]
 *     security: [ { bearerAuth: [] } ]
 */
router.get(
  '/trips/:tripId/guides',
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.list),
);
router.post(
  '/trips/:tripId/guides',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  validate(guideSchema),
  asyncHandler(controller.upsert),
);
router.put(
  '/trips/:tripId/guides',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  validate(bulkGuidesSchema),
  asyncHandler(controller.replaceAll),
);
router.patch(
  '/trips/:tripId/guides/:guideId',
  requireAuth,
  validate(tripAndGuideIdSchema, 'params'),
  validate(guideUpdateSchema),
  asyncHandler(controller.updateOne),
);
router.delete(
  '/trips/:tripId/guides/:guideId',
  requireAuth,
  validate(tripAndGuideIdSchema, 'params'),
  asyncHandler(controller.removeOne),
);

export default router;
