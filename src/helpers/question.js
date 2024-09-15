import { ROLE } from '@/constants';
import { getDistinctSubmissions } from '@/repository/submission';

export const attachSubmissionAttributesToQuestion = async (question, user) => {
  const submissions = await getDistinctSubmissions(question._id);
  question.total_submissions = submissions.length;
  if (user.role === ROLE.GROUP) question.submitted = submissions.some((s) => s.user.toString() === user._id.toString());
  return question;
};
