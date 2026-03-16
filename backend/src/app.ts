// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = () => {
  const app = express();

  // ngrok / reverse proxy support
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use((_req, _res, next) => {
    const e: any = new Error("not found");
    e.statusCode = 404;
    e.code = "NOT_FOUND";
    next(e);
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};