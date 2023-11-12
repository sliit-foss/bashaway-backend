import { APP_ENV } from '@/config';

export const isProduction = APP_ENV === 'production';

export const APPLICATION = 'Tech Events';

export const RAW_REPO_URL = `https://raw.githubusercontent.com/gdgsrilanka/techevents-api/${
  isProduction ? 'main' : 'development'
}`;
