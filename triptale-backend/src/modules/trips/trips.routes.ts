import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { requirePremium } from '../../middleware/premium';
import { validate } from '../../middleware/validate';
import * as controller from './trips.controller';
import { createTripSchema, idParamSchema, listTripsSchema, updateTripSchema } from './trips.schema';

const router = Router();

/**
 * @openapi
 * /api/trips:
 *   get:
 *     tags: [Trips]
 *     summary: Search/list trips with filters and sorting
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *       - in: query
 *         name: categorySlug
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *       - in: query
 *         name: username
 *         schema: { type: string }
 *       - in: query
 *         name: minBudget
 *         schema: { type: number }
 *       - in: query
 *         name: maxBudget
 *         schema: { type: number }
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [recent, popular, rating, budgetAsc, budgetDesc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *   post:
 *     tags: [Trips]
 *     summary: Create a new trip
 *     security: [ { bearerAuth: [] } ]
 */
router.get('/', validate(listTripsSchema, 'query'), asyncHandler(controller.list));
router.post('/', requireAuth, validate(createTripSchema), asyncHandler(controller.create));

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     tags: [Trips]
 *   patch:
 *     tags: [Trips]
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [Trips]
 *     security: [ { bearerAuth: [] } ]
 */
router.get('/:id', validate(idParamSchema, 'params'), asyncHandler(controller.getById));
router.get('/:id/analytics', requireAuth, requirePremium, validate(idParamSchema, 'params'), asyncHandler(controller.analytics));
router.patch(
  '/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  validate(updateTripSchema),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  asyncHandler(controller.remove),
);

export default router;
