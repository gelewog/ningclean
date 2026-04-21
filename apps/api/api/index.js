const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const { join } = require('path');

let app = null;
let initPromise = null;

async function bootstrap() {
  if (app) return app;
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      app = await NestFactory.create(AppModule);
      
      app.enableCors({
        origin: ['https://ningclean.vercel.app', 'https://ningclean-admin.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });

      app.setGlobalPrefix('api');
      app.useStaticAssets(join(process.cwd(), 'uploads'), {
        prefix: '/api/upload',
      });

      await app.init();
      console.log('✅ API initialized');
      return app;
    } catch (error) {
      console.error('❌ Bootstrap failed:', error);
      throw error;
    }
  })();
  
  return initPromise;
}

// Vercel handler
module.exports = async (req, res) => {
  try {
    const app = await bootstrap();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

// Also export as default for ES modules
module.exports.default = module.exports;
