import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

let app: NestExpressApplication | null = null;
let initError: Error | null = null;

async function bootstrap() {
  if (app) return app;
  if (initError) throw initError;
  
  console.log('🔧 Starting bootstrap...');
  console.log('📊 DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('📊 NODE_ENV:', process.env.NODE_ENV);
  console.log('📊 VERCEL:', process.env.VERCEL);
  
  try {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    console.log('✅ Nest app created');

    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://ningclean.vercel.app',
      'https://ningclean-admin.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        if (process.env.NODE_ENV !== 'production') {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, Accept',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.setGlobalPrefix('api');

    // Serve static files
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/api/upload',
    });

    const config = new DocumentBuilder()
      .setTitle('Ningclean API')
      .setDescription('API documentation for Ningclean')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    console.log('✅ App initialized');
    
    return app;
  } catch (error) {
    console.error('❌ Bootstrap error:', error);
    initError = error as Error;
    throw error;
  }
}

// Local development
if (!process.env.VERCEL) {
  bootstrap().then(async (app) => {
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Ningclean API running on http://localhost:${port}`);
    console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
  });
}

// Simple health check that doesn't need database
const simpleHealthCheck = (req: any, res: any) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ningclean API is running (simple mode)',
    timestamp: new Date().toISOString(),
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
    }
  });
};

// Vercel serverless export
export default async function handler(req: any, res: any) {
  console.log('📥 Incoming request:', req.url, req.method);
  
  // Health check endpoint that works even if app fails
  if (req.url === '/api/health' || req.url === '/api') {
    try {
      const app = await bootstrap();
      const expressApp = app.getHttpAdapter().getInstance();
      return expressApp(req, res);
    } catch (error) {
      console.error('Health check failed, using simple response');
      return simpleHealthCheck(req, res);
    }
  }
  
  try {
    const app = await bootstrap();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error: any) {
    console.error('❌ Handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
}
