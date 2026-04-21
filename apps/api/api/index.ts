import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  
  app.setGlobalPrefix('api');
  await app.init();
  
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}
