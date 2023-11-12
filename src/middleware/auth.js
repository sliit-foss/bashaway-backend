import { asyncHandler } from '@sliit-foss/functions';
import { default as createError } from 'http-errors';
import { API_ACCESS_KEY } from '@/config';
import { roles } from '@/models/user';
import { isBlacklistedToken } from '@/repository/token';
import * as userRepository from '@/repository/user';
import { decodeJwtToken } from '@/utils';

const extractToken = (req) => {
  return req.headers.authorization
    ? req.headers.authorization.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]?.replace('null', '')?.replace('undefined', '')
      : null
    : null;
};

export const identify = asyncHandler(async (req) => {
  const token = extractToken(req);
  if (token && !isBlacklistedToken(token)) {
    const decodedUser = decodeJwtToken(token).data;
    const user = decodedUser ? await userRepository.findOne({ _id: decodedUser._id }, false) : null;
    if (user && user.is_active) {
      req.user_token = token;
      req.user = user;
    }
  }
});

export const protect = asyncHandler(async (req) => {
  if (req.headers['x-api-key'] === API_ACCESS_KEY) return;
  const token = extractToken(req);
  if (!token) throw new createError(401, 'Unauthorized');
  const isBackListedToken = isBlacklistedToken(token);
  if (isBackListedToken) throw new createError(401, 'Unauthorized');
  const decodedUser = decodeJwtToken(token).data;
  const user = decodedUser ? await userRepository.findOne({ _id: decodedUser._id }, false) : null;
  if (!user) throw new createError(401, 'Unauthorized');
  if (!user.is_active)
    throw new createError(401, 'Your account has been deactivated. Please contact an admin to resolve it');
  req.user_token = token;
  req.user = user;
});

export const adminProtect = asyncHandler((req) => {
  if (req.headers['x-api-key'] === API_ACCESS_KEY) return;
  if (req.user.role !== roles.superadmin) throw new createError(403, 'You are not permitted to access this resource');
});
