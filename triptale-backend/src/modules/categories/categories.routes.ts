import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as controller from './categories.controller';
import { createCategorySchema, idParamSchema, updateCategorySchema } from './categories.schema';

const router = Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List all categories
 *   post:
 *     tags: [Categories]
 *     summary: Create a category (auth required)
 *     security: [ { bearerAuth: [] } ]
 */
router.get('/', asyncHandler(controller.list));
router.post('/', requireAuth, validate(createCategorySchema), asyncHandler(controller.create));

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *   patch:
 *     tags: [Categories]
 *     security: [ { bearerAuth: [] } ]
 *   delete:
 *     tags: [Categories]
 *     security: [ { bearerAuth: [] } ]
 */
router.get('/:id', validate(idParamSchema, 'params'), asyncHandler(controller.getById));
router.patch(
  '/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  validate(updateCategorySchema),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  requireAuth,
  validate(idParamSchema, 'params'),
  asyncHandler(controller.remove),
);

export default router;
