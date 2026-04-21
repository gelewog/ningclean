import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

let app: NestExpressApplication | null = null;

async function bootstrap() {
  if (app) return app;
  
  console.log('🔧 Starting NestJS app...');
  console.log('📊 DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
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
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/api/upload' });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ningclean API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  console.log('✅ NestJS app initialized');
  return app;
}

// Local dev
if (!process.env.VERCEL) {
  bootstrap().then(async (app) => {
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
  });
}

// Vercel handler
export default async function handler(req: any, res: any) {
  try {
    const app = await bootstrap();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error: any) {
    console.error('❌ Handler error:', error);
    res.status(500).json({ 
      error: 'Server Error', 
      message: error.message,
      stack: error.stack
    });
  }
}
