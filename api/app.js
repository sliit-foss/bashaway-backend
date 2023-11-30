import express from 'express';
import context from 'express-http-context';
import httpLogger from '@sliit-foss/http-logger';
import crypto from 'crypto';
import helmet from 'helmet';
import { omit, pick } from 'lodash';
import { default as connectDB } from '@/database';
import { errorHandler, queryMapper, responseInterceptor } from '@/middleware';
import { default as routes } from '@/routes/index.routes';

connectDB();

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", 'https: data:']
      }
    }
  })
);

app.get('/', (_, res) => res.status(200).json({ message: 'Bashaway Server Up and Running' }));

app.use(context.middleware);

app.use((req, _res, next) => {
  context.set('correlationId', req.headers['x-correlation-id'] ?? crypto.randomBytes(16).toString('hex'));
  context.set('origin', req.headers['x-origin-application']);
  next();
});

app.use(
  httpLogger({
    loggable: ({ headers, body: payload }) => ({
      headers: pick(headers, ['x-user-email', 'user-agent']),
      payload: omit(payload, ['password', 'new_password', 'old_password'])
    })
  })
);

app.use(queryMapper);

app.use('/api', routes);

app.use(responseInterceptor);

app.use(errorHandler);

global.__basedir = __dirname;

export default app;
