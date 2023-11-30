const blacklistedTokens = [];

export const blacklistToken = (token) => {
  blacklistedTokens.push(token);
};

export const isBlacklistedToken = (token) => {
  return blacklistedTokens.includes(token);
};
