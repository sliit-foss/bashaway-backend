import context from 'express-http-context';

export const responseInterceptor = (_req, res, next = () => {}) => {
  if (res.headersSent) return;
  res.set('x-correlation-id', context.get('correlationId'));
  next();
};
