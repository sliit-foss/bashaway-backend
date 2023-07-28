import jwt from 'jsonwebtoken';

export const sendTokenResponse = (res, user, message) => {
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  res.status(200).json({
    data: { user, refresh_token: refreshToken, access_token: accessToken },
    message
  });
};

export const generateToken = (user) => {
  return jwt.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE}m`
  });
};

export const decodeJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const sendRefreshTokenResponse = (res, user, message) => {
  const accessToken = generateToken(user);
  res.status(200).json({
    data: { access_token: accessToken },
    message
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_REFRESH_EXPIRE}d`
  });
};
