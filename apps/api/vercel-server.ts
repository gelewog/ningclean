import { createServer, IncomingMessage, ServerResponse } from 'http';

// Simple NestJS adapter for Vercel Serverless
let cachedServer: any = null;

async function getServer() {
  if (cachedServer) return cachedServer;

  const { AppModule } = await import('./src/app.module');
  const { NestFactory } = await import('@nestjs/core');
  const { NestExpressApplication } = await import('@nestjs/platform-express');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'https://ningclean.vercel.app',
      'https://ningclean-admin.vercel.app',
      'https://web-nine-rouge-16.vercel.app',
      'https://admin-tau-green-45.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.init();
  cachedServer = app.getHttpAdapter().getInstance();
  return cachedServer;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    console.log('[Vercel] Request received:', req.method, req.url);
    const server = await getServer();
    return server(req, res);
  } catch (error: any) {
    console.error('[Vercel] Handler error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server Error', message: error.message }));
  }
}
