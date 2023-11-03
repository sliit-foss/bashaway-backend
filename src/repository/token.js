const blacklistedTokens = [];

export const blacklist = (token) => {
  blacklistedTokens.push(token);
};

export const isBlacklistedToken = (token) => {
  return blacklistedTokens.includes(token);
};
