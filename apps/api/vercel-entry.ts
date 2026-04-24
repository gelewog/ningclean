// apps/api/vercel-entry.ts
// Standalone Vercel handler - NOT webpack bundled
// This file should NOT be processed by nest build

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { AppModule } from './src/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

let server: any = null;

async function bootstrap() {
  if (server) return server;

  console.log('[Vercel] Bootstrapping NestJS...');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://ningclean.vercel.app',
      'https://ningclean-admin.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.init();

  server = app.getHttpAdapter().getInstance();
  console.log('[Vercel] NestJS ready');

  return server;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const nestServer = await bootstrap();
    return nestServer(req, res);
  } catch (error: any) {
    console.error('[Vercel] Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message }));
  }
}
