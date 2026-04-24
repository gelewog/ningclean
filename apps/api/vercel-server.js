// Vercel Serverless Handler
const path = require('path');

// Lazy load NestJS to avoid issues
let nestServer = null;

async function loadNest() {
  if (nestServer) return nestServer;

  console.log('[Vercel] Loading NestJS...');
  console.log('[Vercel] CWD:', process.cwd());
  console.log('[Vercel] __dirname:', __dirname);

  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), 'dist', 'app.module'),
    path.join(__dirname, '..', 'dist', 'app.module'),
    path.join(__dirname, 'dist', 'app.module'),
    '/var/task/dist/app.module',
    '/var/task/apps/api/dist/app.module'
  ];

  let appModule = null;
  let loadedPath = null;

  for (const p of possiblePaths) {
    console.log('[Vercel] Trying:', p);
    try {
      appModule = require(p);
      loadedPath = p;
      console.log('[Vercel] Found at:', p);
      break;
    } catch (e) {
      console.log('[Vercel] Not found at:', p);
    }
  }

  if (!appModule) {
    throw new Error('Could not find app.module at any path');
  }

  const { AppModule } = appModule;
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
  console.log('[Vercel] NestJS ready at:', loadedPath);

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
