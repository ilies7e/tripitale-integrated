import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFound } from './middleware/error';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import tripsRoutes from './modules/trips/trips.routes';
import commentsRoutes from './modules/comments/comments.routes';
import ratingsRoutes from './modules/ratings/ratings.routes';
import savedTripsRoutes from './modules/saved-trips/saved-trips.routes';
import mediaRoutes from './modules/media/media.routes';
import tripGuidesRoutes from './modules/trip-guides/trip-guides.routes';
import followsRoutes from './modules/follows/follows.routes';

export const buildApp = () => {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',') }));
  app.use(compression());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  if (env.NODE_ENV !== 'test') app.use(morgan('dev'));

  // static uploads (development convenience)
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

  // health
  app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

  // docs
  app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/trips', tripsRoutes);
  app.use('/api/saved-trips', savedTripsRoutes);
  // routes that mix /trips/:tripId/* and /comments|/media|/ratings/*
  app.use('/api', commentsRoutes);
  app.use('/api', ratingsRoutes);
  app.use('/api', mediaRoutes);
  app.use('/api', tripGuidesRoutes);
  app.use('/api', followsRoutes);

  app.get('/', (_req, res) =>
    res.json({
      name: 'TripTale API',
      version: '1.0.0',
      docs: `${env.APP_URL}/api/docs`,
    }),
  );

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
