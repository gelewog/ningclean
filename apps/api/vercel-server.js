// Vercel Serverless Handler - NOT bundled with webpack
// This must remain as plain JavaScript

const { createServer } = require('http');
const { parse } = require('url');

// Lazy load NestJS to avoid issues
let nestServer = null;

async function loadNest() {
  if (nestServer) return nestServer;

  console.log('[Vercel] Loading NestJS...');

  const { AppModule } = require('./dist/app.module');
  const { NestFactory } = require('@nestjs/core');
  const { NestExpressApplication } = require('@nestjs/platform-express');

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

  nestServer = app.getHttpAdapter().getInstance();
  console.log('[Vercel] NestJS ready');

  return nestServer;
}

module.exports = async function handler(req, res) {
  try {
    const server = await loadNest();
    return server(req, res);
  } catch (error) {
    console.error('[Vercel] Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message }));
  }
};
