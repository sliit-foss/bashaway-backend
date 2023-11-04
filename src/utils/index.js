import context from 'express-http-context';

export * from './config';
export * from './json';
export * from './jwt';
export * from './response';

export const createEnum = (constantArray) =>
  constantArray.reduce((acc, val) => {
    acc[val] = val;
    return acc;
  }, {});

export const isFromAdmin = () => context.get('origin') === 'admin';

export const isProduction = process.env.APP_ENV === 'production';

// TODO: Replace this with your own repo if you are forking this project
export const rawRepoUrl = `https://raw.githubusercontent.com/gdgsrilanka/tech-events-api/${
  isProduction ? 'main' : 'development'
}`;
