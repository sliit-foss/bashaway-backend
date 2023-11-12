import { roles } from '@/models/user';

export const challengeFilters = (user, baseFilters = {}) => {
  if (user?.role !== roles.superadmin) {
    baseFilters.enabled = true;
  }
  return {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user?._id }],
    ...baseFilters
  };
};
