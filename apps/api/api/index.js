// Vercel serverless entry point - CommonJS compatible
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');

let cachedApp = null;

async function bootstrap() {
  if (cachedApp) return cachedApp;
  
  console.log('[API] Starting NestJS app...');
  
  const { AppModule } = require('../src/app.module');
  
  cachedApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // CORS
  cachedApp.enableCors({
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

// Vercel serverless handler - IMPORTANT: export as CommonJS
module.exports = async (req, res) => {
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
};
