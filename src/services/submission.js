import { moduleLogger } from '@sliit-foss/module-logger';
import createError from 'http-errors';
import { ROLE } from '@/constants';
import { findQuestion, getMaxScore } from '@/repository/question';
import {
  getLatestSubmissionTime,
  getSubmissionById,
  getSubmissions,
  insertGrade,
  insertSubmission
} from '@/repository/submission';
import { findOneAndUpdateUser } from '@/repository/user';
import { isFromAdmin, isOwnSubmissionLink, submissionCooldown, teamCooldownSeconds } from '@/utils';
import { triggerScorekeeper as initiateTesting } from './github';

const logger = moduleLogger('Submission-service');

export const createSubmission = async ({ question: questionId, link }, user) => {
  const question = await findQuestion({ _id: questionId });
  if (!question) throw new createError(422, 'Invalid question ID');
  if (!question.enabled) throw new createError(400, 'You cannot make a submission for a disabled question');

  if (!isOwnSubmissionLink(link, user.name)) throw new createError(422, 'Invalid submission link');

  const [lastAny, lastForQuestion] = await Promise.all([
    getLatestSubmissionTime({ user: user._id }),
    getLatestSubmissionTime({ user: user._id, question: questionId })
  ]);
  const wait = submissionCooldown(lastAny, lastForQuestion);
  if (wait) {
    const scope = wait > submissionCooldown(lastAny) ? ' to this question' : '';
    throw new createError(429, `Please wait ${wait} seconds before submitting${scope} again`);
  }

  // One atomic claim per team, so requests sent at the same instant cannot all pass the check above
  const seconds = teamCooldownSeconds();
  const free = { $lte: new Date(Date.now() - seconds * 1000) };
  const claimed =
    !seconds ||
    (await findOneAndUpdateUser(
      { _id: user._id, $or: [{ last_submitted_at: null }, { last_submitted_at: free }] },
      { last_submitted_at: new Date() }
    ));
  if (!claimed) throw new createError(429, 'Please wait a few seconds before submitting again');

  const submission = await insertSubmission(user._id, questionId, link);
  initiateTesting(
    user.name,
    user.email,
    submission._id,
    submission.link,
    question.codebase_url,
    question.name,
    question.strict_inputs
  ).catch((err) => logger.error(`Failed to trigger scorekeeper for submission ${submission._id} - ${err.message}`));
};

export const viewSubmissions = (query, user) => {
  if (user.role != ROLE.ADMIN || !isFromAdmin()) {
    if (!query.filter) query.filter = {};
    query.filter.user = user._id;
  }
  return getSubmissions(query);
};

export const gradeSubmission = async (submissionId, { score, automatically_graded: automated }, user) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) throw new createError(422, 'Invalid submission ID');
  const maxScore = await getMaxScore(submission.question.toString());

  // No user means the scorekeeper: a pass always earns the full score and never replaces a manual grade
  if (!user) {
    if (submission.graded_by) throw new createError(409, 'Submission has already been graded manually');
    return insertGrade(submissionId, maxScore, true);
  }

  score ??= maxScore;

  if (score < 0) throw new createError(422, 'Score must be greater than or equal to 0');
  else if (maxScore < score)
    throw new createError(422, 'Score must be less than or equal to the max score for the question');
  await insertGrade(submissionId, score, !!automated, user?._id);
};
