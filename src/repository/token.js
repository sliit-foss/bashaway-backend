const blackListedTokens = [];

export const addBackListToken = (token) => {
  blackListedTokens.push(token);
};

export const isBlacklistedToken = (token) => {
  return blackListedTokens.includes(token);
};
