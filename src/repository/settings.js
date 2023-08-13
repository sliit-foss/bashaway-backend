import Setting from '@/models/setting';

export const getSettingsDoc = () => {
  return Setting.findOne().lean();
};

export const updateSettingsDoc = async (settings) => {
  await Setting.findOneAndUpdate({}, settings, { new: true, upsert: true });
};
