const tokenBlacklist = new Set();

const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
};

const isBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

const clearBlacklist = () => {
  tokenBlacklist.clear();
};

const getBlacklistSize = () => {
  return tokenBlacklist.size;
};

module.exports = {
  addToBlacklist,
  isBlacklisted,
  clearBlacklist,
  getBlacklistSize
};
