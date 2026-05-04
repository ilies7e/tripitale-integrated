import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { upload } from '../../middleware/upload';
import * as controller from './media.controller';
import { idParamSchema, tripIdParamSchema } from './media.schema';

const router = Router();

/**
 * @openapi
 * /api/trips/{tripId}/media:
 *   get:
 *     tags: [Media]
 *     summary: List media for a trip
 *   post:
 *     tags: [Media]
 *     summary: Upload media (multipart/form-data, field name "files")
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               caption: { type: string }
 * /api/media/{id}:
 *   delete:
 *     tags: [Media]
 *     security: [ { bearerAuth: [] } ]
 */
router.get(
  '/trips/:tripId/media',
  validate(tripIdParamSchema, 'params'),
  asyncHandler(controller.listForTrip),
);
router.post(
  '/trips/:tripId/media',
  requireAuth,
  validate(tripIdParamSchema, 'params'),
  upload.array('files', 10),
  asyncHandler(controller.attach),
);
router.delete(
  '/media/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  asyncHandler(controller.remove),
);

export default router;
