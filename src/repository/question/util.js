import { ROLE } from '@/constants';

export const questionFilters = (user, baseFilters = {}) => {
  if (user.role !== ROLE.ADMIN) {
    baseFilters.enabled = true;
  }
  const filter = {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
    ...baseFilters
  };
  return filter;
};
