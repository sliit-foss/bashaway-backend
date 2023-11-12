import { roles } from '@/models/user';

export const eventFilters = (user, baseFilters = {}) => {
  if (user?.role !== roles.superadmin) {
    baseFilters.settings.enabled = true;
  }
  return {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user?._id }],
    ...baseFilters
  };
};
