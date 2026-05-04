import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import * as controller from './auth.controller';
import { loginSchema, refreshSchema, registerSchema } from './auth.schema';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Create a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email:    { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               bio:      { type: string }
 *     responses:
 *       201: { description: Created }
 */
router.post('/register', validate(registerSchema), asyncHandler(controller.register));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.post('/login', validate(loginSchema), asyncHandler(controller.login));

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Exchange a refresh token for a new pair of tokens
 */
router.post('/refresh', validate(refreshSchema), asyncHandler(controller.refresh));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Revoke a refresh token
 */
router.post('/logout', validate(refreshSchema), asyncHandler(controller.logout));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated user
 *     security: [ { bearerAuth: [] } ]
 */
router.get('/me', requireAuth, asyncHandler(controller.me));

export default router;
