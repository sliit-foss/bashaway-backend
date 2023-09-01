import context from 'express-http-context';

export * from './config';
export * from './jwt';
export * from './response';

export const isFromAdmin = () => context.get('origin') === 'admin';

export const isProduction = process.env.APP_ENV === 'production';

export const rawRepoUrl = `https://raw.githubusercontent.com/sliit-foss/bashaway-backend/${
  isProduction ? 'main' : 'development'
}`;
