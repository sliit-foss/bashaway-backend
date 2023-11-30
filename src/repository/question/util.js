export const questionFilters = (user, baseFilters = {}) => {
  if (user.role !== 'ADMIN') {
    baseFilters.enabled = true;
  }
  return {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
    ...baseFilters
  };
};
