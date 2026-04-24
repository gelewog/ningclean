// Vercel Serverless Entry Point
// This file is the entry point for Vercel Functions

import { createServer, request as httpRequest } from 'http';
import { parse } from 'url';

// Dynamic imports to avoid issues with webpack
let nestApp: any = null;

async function loadNestApp() {
  if (nestApp) return nestApp;

  try {
    console.log('[Vercel] Loading NestJS app...');

    // Import built modules
    const { AppModule } = await import('./dist/app.module');

    // Import NestJS dynamically
    const [{ NestFactory }, { NestExpressApplication }] = await Promise.all([
      import('@nestjs/core'),
      import('@nestjs/platform-express')
    ]);

    // Create the app
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS
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

    // Set global prefix
    app.setGlobalPrefix('api');

    // Initialize
    await app.init();

    nestApp = app.getHttpAdapter().getInstance();
    console.log('[Vercel] NestJS app loaded successfully');

    return nestApp;
  } catch (error) {
    console.error('[Vercel] Failed to load NestJS app:', error);
    throw error;
  }
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  try {
    const server = await loadNestApp();
    return server(req, res);
  } catch (error: any) {
    console.error('[Vercel] Handler error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }));
  }
}
