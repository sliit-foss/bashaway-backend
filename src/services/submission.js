import { findQuestion, getMaxScore } from '@/repository/question';
import { getSubmissionById, getSubmissions, insertGrade, insertSubmission } from '@/repository/submission';

export const createSubmission = async ({ question, link }, { _id }) => {
  if (!(await findQuestion({ _id: question })))
    return {
      status: 422,
      message: 'Invalid question ID'
    };

  await insertSubmission(_id, question, link);
};

export const viewSubmissions = (query, user) => {
  if (user.role != 'ADMIN') {
    if (!query.filter) query.filter = {};
    query.filter.user = user._id;
  }
  return getSubmissions(query);
};

export const gradeSubmission = async (submissionId, { score }, { _id }) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission)
    return {
      status: 422,
      message: 'Invalid submission ID'
    };
  const maxScore = await getMaxScore(submission.question.toString());

  if (score < 0)
    return {
      status: 422,
      message: 'Score must be greater than or equal to 0'
    };
  else if (maxScore < score)
    return {
      status: 422,
      message: 'Score must be less than or equal to the max score for the question'
    };

  await insertGrade(submissionId, score, _id);
};
