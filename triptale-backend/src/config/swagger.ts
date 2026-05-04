import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TripTale API',
      version: '1.0.0',
      description: 'REST API for the TripTale travel-sharing & planning mobile app.',
    },
    servers: [{ url: env.APP_URL }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['src/modules/**/*.routes.ts'],
});
