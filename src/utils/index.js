import context from 'express-http-context';
import { omit } from 'lodash';

export * from './config';
export * from './json';
export * from './jwt';
export * from './response';

export const isFromAdmin = () => context.get('origin') === 'admin';

export const isProduction = process.env.APP_ENV === 'production';

// TODO: Replace this with your own repo if you are forking this project
export const rawRepoUrl = `https://raw.githubusercontent.com/sliit-foss/bashaway-backend/${
  isProduction ? 'main' : 'development'
}`;

// The scorekeeper key is accepted on the grading route only
export const isScorekeeper = (req) =>
  !!process.env.API_ACCESS_KEY &&
  req.headers['x-api-key'] === process.env.API_ACCESS_KEY &&
  req.method === 'PATCH' &&
  /^\/api\/submissions\/[0-9a-f]{24}$/.test(req.originalUrl);

export const isOwnSubmissionLink = (link, teamName) => {
  const folder = `https://${process.env.AZURE_SOLUTION_UPLOAD_STORAGE_ACCOUNT}.blob.core.windows.net/${
    process.env.AZURE_STORAGE_CONTAINER
  }/${encodeURIComponent(teamName).replace(/'/g, '%27')}/`; // the portal's Azure client writes ' as %27
  // Azure decodes %2F, treats \ as / and drops a dot at the end of a folder name, so each could reach another team's folder
  return link.startsWith(folder) && !/[?#\\]|%2f|%5c|\.\//i.test(link) && new URL(link).href === link;
};

// A missing, blank or malformed setting keeps the default; 0 switches the limit off
const cooldownSetting = (name, fallback) => {
  const seconds = Number(process.env[name]?.trim() || NaN);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : fallback;
};

export const teamCooldownSeconds = () => cooldownSetting('SUBMISSION_COOLDOWN_SECONDS', 30);

// Seconds a team still has to wait before its next submission; 0 means it can submit now
export const submissionCooldown = (lastAny, lastForQuestion, now = Date.now()) => {
  const left = (last, seconds) => (last ? Math.ceil((new Date(last).getTime() - now) / 1000 + seconds) : 0);
  return Math.max(
    0,
    left(lastAny, teamCooldownSeconds()),
    left(lastForQuestion, cooldownSetting('QUESTION_COOLDOWN_SECONDS', 180))
  );
};

export const loggable = ({ headers, body }) => ({
  headers: omit(headers, ['authorization', 'x-api-key', 'cookie']),
  payload: omit(body, ['password', 'new_password', 'old_password', 'refresh_token'])
});
