import { roles } from '@/models/user';

export const eventFilters = (user, baseFilters = {}) => {
  if (baseFilters.availability !== undefined) {
    if (baseFilters.availability) {
      baseFilters['settings.registration_start'] = { $lte: new Date() };
      baseFilters['settings.registration_end'] = { $gte: new Date() };
    } else {
      baseFilters['$and'] = [
        {
          $or: [
            { 'settings.registration_start': { $gt: new Date() } },
            { 'settings.registration_end': { $lt: new Date() } }
          ]
        }
      ];
    }
  }
  if (user?.role !== roles.superadmin) {
    baseFilters['settings.enabled'] = true;
  }
  return {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user?._id }],
    ...baseFilters
  };
};
