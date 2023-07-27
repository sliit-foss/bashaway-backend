const backListTokens = [];

export const addBackListToken = (token) => {
  backListTokens.push(token);
};

export const isTokenBackListed = (token) => {
  return backListTokens.includes(token);
};
