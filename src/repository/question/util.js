export const questionFilters = (user, baseFilters = {}) => {
  let filter;
  if (user.role === 'ADMIN') {
    filter = {
      $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
      $and: [baseFilters]
    };
  } else {
    baseFilters.enabled = true;
  }
  filter = {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
    $and: [baseFilters]
  };
  return filter;
};
