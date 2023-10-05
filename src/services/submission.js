import createError from 'http-errors';
import { findQuestion, getMaxScore } from '@/repository/question';
import { getSubmissionById, getSubmissions, insertGrade, insertSubmission } from '@/repository/submission';
import { triggerScorekeeper as initiateTesting } from './github';

export const createSubmission = async ({ question: questionId, link }, user) => {
  const question = await findQuestion({ _id: questionId });
  if (!question) throw new createError(422, 'Invalid question ID');
  const submission = await insertSubmission(user._id, questionId, link);
  initiateTesting(
    user.email,
    submission._id,
    submission.link,
    question.codebase_url,
    question.name,
    question.strict_inputs
  );
};

export const viewSubmissions = (query, user) => {
  if (user.role != 'ADMIN') {
    if (!query.filter) query.filter = {};
    query.filter.user = user._id;
  }
  return getSubmissions(query);
};

export const gradeSubmission = async (submissionId, { score, automatically_graded: automated }, user) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) throw new createError(422, 'Invalid submission ID');
  const maxScore = await getMaxScore(submission.question.toString());

  score ??= maxScore;

  if (score < 0) throw new createError(422, 'Score must be greater than or equal to 0');
  else if (maxScore < score)
    throw new createError(422, 'Score must be less than or equal to the max score for the question');
  await insertGrade(submissionId, score, !!automated, user?._id);
};
