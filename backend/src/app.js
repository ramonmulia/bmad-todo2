import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import todoRoutes from './routes/todos.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet({ contentSecurityPolicy: false }));

  // CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));

  // Body parsing
  app.use(express.json({ limit: '10kb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/todos', todoRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint not found' });
  });

  // Global error handler
  app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Internal server error' });
  });

  return app;
}
