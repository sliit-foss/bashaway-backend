import Setting from '@/models/setting';

export const getDoc = () => {
  return Setting.findOne().lean();
};

export const updateDoc = async (settings) => {
  await Setting.findOneAndUpdate({}, settings, { new: true, upsert: true });
};
