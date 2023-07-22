import crypto from 'crypto';
import express from 'express';
import context from 'express-http-context';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from '@/database';
import { errorHandler, queryMapper, responseInterceptor } from '@/middleware';
import { default as routes } from '@/routes/index.routes';

require('dotenv').config();

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

app.use(helmet());

app.use(compression());

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ extended: true }));

app.use(context.middleware);

app.use((req, _res, next) => {
  context.set('correlationId', req.headers['x-correlation-id'] ?? crypto.randomBytes(16).toString('hex'));
  next();
});

app.use(queryMapper);

app.get('/', (_, res) => res.status(200).json({ message: 'Bashaway Server Up and Running' }));

app.use('/api', routes);

app.use(responseInterceptor);

app.use(errorHandler);

connectDB();

global.__basedir = __dirname;

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Bashaway server successfully started on port ${port}`);
});
