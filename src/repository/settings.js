import Setting from '@/models/setting';

export const getDoc = () => {
  return Setting.findOne().lean();
};

export const updateDoc = async (settings) => {
  await Setting.findOneAndUpdate({}, settings, { new: true, upsert: true });
};

export const getRegistrationDeadline = async () => {
  const settings = await getDoc();
  return settings.registration_deadline;
};

export const getSubmissionDeadline = async () => {
  const settings = await getDoc();
  return settings.submission_deadline;
};

export const getLeaderboardSettings = async () => {
  const settings = await getDoc();
  return settings.leaderboard;
};
