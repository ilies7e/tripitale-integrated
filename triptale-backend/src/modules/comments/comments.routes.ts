import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as controller from './comments.controller';
import {
  createCommentSchema,
  idParamSchema,
  tripIdParamSchema,
  updateCommentSchema,
} from './comments.schema';

const router = Router();

/**
 * @openapi
 * /api/trips/{tripId}/comments:
 *   get:
 *     tags: [Comments]
 *     summary: List comments on a trip
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment
 *     security: [ { bearerAuth: [] } ]
 */
router.get(
  '/trips/:tripId/comments',
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.listForTrip),
);
router.post(
  '/trips/:tripId/comments',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  validate(createCommentSchema),
  asyncHandler(controller.create),
);

/**
 * @openapi
 * /api/comments/{id}:
 *   patch:
 *     tags: [Comments]
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [Comments]
 *     security: [ { bearerAuth: [] } ]
 */
router.patch(
  '/comments/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  validate(updateCommentSchema),
  asyncHandler(controller.update),
);
router.delete(
  '/comments/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  asyncHandler(controller.remove),
);

export default router;
