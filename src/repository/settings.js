import Settings from '@/models/settings';

export const getSettings = (filters, options = {}) => {
  return Settings.findOne(filters, options).lean();
};

export const updateSettings = async (settings) => {
  await Settings.findOneAndUpdate({}, settings, { new: true });
};
