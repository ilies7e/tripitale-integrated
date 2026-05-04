import { buildApp } from './app';
import { env } from './config/env';
import { prisma } from './config/db';

const app = buildApp();

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[triptale] listening on ${env.APP_URL} (env=${env.NODE_ENV})`);
  // eslint-disable-next-line no-console
  console.log(`[triptale] docs:    ${env.APP_URL}/api/docs`);
});

const shutdown = async (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`[triptale] received ${signal}, shutting down…`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
