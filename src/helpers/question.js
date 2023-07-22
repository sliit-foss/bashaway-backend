import { getSubmissionCount } from '../repository/submission';

export const attachSubmissionAttributesToQuestion = async (question) => {
  question.total_submissions = await getSubmissionCount(question._id);
  return question;
};
