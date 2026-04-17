import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { setupRoutes } from './src/server/routes.ts';
import { initDb } from './src/server/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

  // Initialize DB
  initDb();

  // Setup API Routes
  setupRoutes(app);

  // Serve uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vitePkg = 'vite';
    const { createServer: createViteServer } = await import(vitePkg);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
