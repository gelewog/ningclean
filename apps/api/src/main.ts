import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

let cachedApp: NestExpressApplication | null = null;

async function bootstrap() {
  if (cachedApp) return cachedApp;
  
  console.log('[API] Starting NestJS app...');
  console.log('[API] DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('[API] SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
  
  cachedApp = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // CORS
  cachedApp.enableCors({
    origin: [
      'https://ningclean.vercel.app',
      'https://ningclean-admin.vercel.app',
      'https://web-nine-rouge-16.vercel.app',
      'https://admin-tau-green-45.vercel.app',
      'https://ningclean-admin-production.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  cachedApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  cachedApp.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ningclean API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(cachedApp, config);
  SwaggerModule.setup('api/docs', cachedApp, document);

  await cachedApp.init();
  console.log('[API] NestJS app initialized');
  return cachedApp;
}

// Local dev
if (!process.env.VERCEL) {
  bootstrap().then(async (app) => {
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
  });
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  try {
    const app = await bootstrap();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error: any) {
    console.error('[API] Handler error:', error);
    res.status(500).json({ 
      error: 'Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

export { bootstrap };
