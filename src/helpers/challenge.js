import { roles } from '@/models/user';
import { getDistinctSubmissions } from '@/repository/submission';

export const attachSubmissionAttributesToChallenge = async (challenge, user) => {
  const submissions = await getDistinctSubmissions(challenge._id);
  challenge.total_submissions = submissions.length;
  if (user.role === roles.entrant)
    challenge.submitted = submissions.some((s) => s.user.toString() === user._id.toString());
  return challenge;
};
