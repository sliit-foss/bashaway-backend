import jwt from 'jsonwebtoken';
import { JWT } from '@/config';

export const sendTokenResponse = (res, user, message) => {
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  res.status(200).json({
    data: { user, refresh_token: refreshToken, access_token: accessToken },
    message
  });
};

export const generateToken = (user) => {
  return jwt.sign({ data: user }, JWT.SECRET, {
    expiresIn: `${JWT.EXPIRE}m`
  });
};

export const decodeJwtToken = (token) => {
  return jwt.verify(token, JWT.SECRET);
};

export const sendRefreshTokenResponse = (res, user, message) => {
  const accessToken = generateToken(user);
  res.status(200).json({
    data: { access_token: accessToken },
    message
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ data: user }, JWT.SECRET, {
    expiresIn: `${JWT.REFRESH_EXPIRE}d`
  });
};
