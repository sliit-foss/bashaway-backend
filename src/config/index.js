import dotenv from 'dotenv';

dotenv.config();

export const MAIL_CREDENTIALS = {
  HOST: process.env.MAIL_HOST,
  USER: process.env.MAIL_USER,
  PASS: process.env.MAIL_PASSWORD
};

export const SCOREKEEPER = {
  REPO_OWNER: process.env.SCOREKEEPER_REPO_OWNER,
  REPO_NAME: process.env.SCOREKEEPER_REPO_NAME,
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN
};

export const JWT = {
  SECRET: process.env.JWT_SECRET ?? 'secret',
  EXPIRE: process.env.JWT_EXPIRE ?? 30,
  REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE ?? 30
};

export const AZURE = {
  CHALLENGE_UPLOAD_SAS_TOKEN: process.env.AZURE_CHALLENGE_UPLOAD_SAS_TOKEN,
  SOLUTION_DOWNLOAD_SAS_TOKEN: process.env.AZURE_SOLUTION_DOWNLOAD_SAS_TOKEN
};

export const PAYHERE = {
  BASE_URL: process.env.PAYHERE_BASE_URL,
  MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID,
  MERCHANT_SECRET: process.env.PAYHERE_MERCHANT_SECRET,
  AUTHORIZATION_CODE: process.env.PAYHERE_AUTHORIZATION_CODE
};

export const PORT = process.env.PORT || 3000;

export const APP_ENV = process.env.APP_ENV;

export const MONGO_URI = process.env.MONGO_URI; // Must be a replica set

export const APP_DOMAIN = process.env.APP_DOMAIN || `http://localhost:${PORT}`;

export const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || `http://localhost:3001`;

export const ADMIN_FRONTEND_DOMAIN = process.env.ADMIN_FRONTEND_DOMAIN || `http://localhost:3002`;

export const API_ACCESS_KEY = process.env.API_ACCESS_KEY;

export default {
  MAIL_CREDENTIALS,
  SCOREKEEPER,
  JWT,
  AZURE,
  PAYHERE,
  PORT,
  APP_ENV,
  MONGO_URI,
  APP_DOMAIN,
  FRONTEND_DOMAIN,
  ADMIN_FRONTEND_DOMAIN,
  API_ACCESS_KEY
};
