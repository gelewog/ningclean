// Vercel serverless entry point
// Standalone bootstrap - does not depend on prebuilt dist/main.js

const path = require('path');
const { register } = require('ts-node');

// Register ts-node to transpile TypeScript on the fly
register({
  transpileOnly: true,
  project: path.join(__dirname, '..', 'tsconfig.json'),
});

// Now we can require TypeScript files
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { AppModule } = require('../src/app.module');

let app = null;

async function bootstrap() {
  if (app) return app;
  
  console.log('[API] Starting NestJS app...');
  console.log('[API] DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('[API] SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
  
  app = await NestFactory.create(AppModule);

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

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ningclean API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  console.log('[API] NestJS app initialized');
  return app;
}

async function handler(req, res) {
  try {
    const app = await bootstrap();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    console.error('[API] Handler error:', error);
    res.status(500).json({ 
      error: 'Server Error', 
      message: error.message,
    });
  }
}

module.exports = handler;
module.exports.handler = handler;
module.exports.bootstrap = bootstrap;
