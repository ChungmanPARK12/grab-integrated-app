// src/app
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api', routes);

  app.use((_req, _res, next) => {
  const e: any = new Error("not found");
  e.statusCode = 404;
  e.code = "NOT_FOUND";
  next(e);
  });

  app.use(errorHandler);

  return app;
};
