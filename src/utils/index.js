import context from 'express-http-context';

export * from './config';
export * from './jwt';
export * from './response';

export const isFromAdmin = () => context.get('origin') === 'admin';
