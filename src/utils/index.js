import context from 'express-http-context';

export * from './json';
export * from './jwt';
export * from './repository';
export * from './response';

export const isFromAdmin = () => context.get('origin') === 'admin';
