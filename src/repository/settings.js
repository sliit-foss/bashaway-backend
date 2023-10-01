import Setting from '@/models/setting';

export const getSettingsDoc = () => {
  return Setting.findOne().lean();
};

export const updateSettingsDoc = async (settings) => {
  await Setting.findOneAndUpdate({}, settings, { new: true, upsert: true });
};

export const getRegistrationDeadline = async () => {
  const settings = await getSettingsDoc();
  return settings.registration_deadline;
};

export const getSubmissionDeadline = async () => {
  const settings = await getSettingsDoc();
  return settings.submission_deadline;
};

export const getLeaderboardSettings = async () => {
  const settings = await getSettingsDoc();
  return settings.leaderboard;
};
