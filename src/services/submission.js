import createError from 'http-errors';
import { findQuestion, getMaxScore } from '@/repository/question';
import {
  getLeaderboardData,
  getSubmissionById,
  getSubmissions,
  insertGrade,
  insertSubmission
} from '@/repository/submission';

export const createSubmission = async ({ question, link }, { _id }) => {
  if (!(await findQuestion({ _id: question }))) throw new createError(422, 'Invalid question ID');
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
  if (!submission) throw new createError(422, 'Invalid submission ID');
  const maxScore = await getMaxScore(submission.question.toString());

  if (!score) {
    score = maxScore;
  }

  if (score < 0) throw new createError(422, 'Score must be greater than or equal to 0');
  else if (maxScore < score)
    throw new createError(422, 'Score must be less than or equal to the max score for the question');
  await insertGrade(submissionId, score, _id);
};

export const getLeaderboard = async () => {
  const result = await getLeaderboardData();
  return result;
};
