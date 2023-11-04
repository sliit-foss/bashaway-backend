import { roles } from '@/models/user';

export const challengeFilters = (user, baseFilters = {}) => {
  let filter;
  if (user.role === roles.superadmin) {
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
