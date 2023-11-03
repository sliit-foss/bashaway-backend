import createError from 'http-errors';
import * as challengeRepository from '@/repository/challenge';
import * as submissionRepository from '@/repository/submission';
import { triggerScorekeeper as initiateTesting } from './github';

export const create = async ({ challenge: challengeId, link }, user) => {
  const challenge = await challengeRepository.findOne({ _id: challengeId });
  if (!challenge) throw new createError(422, 'Invalid challenge ID');
  if (!challenge.enabled) throw new createError(400, 'You cannot make a submission for a disabled challenge');
  const submission = await submissionRepository.create(user._id, challengeId, link);
  initiateTesting(
    user.name,
    user.email,
    submission._id,
    submission.link,
    challenge.codebase_url,
    challenge.name,
    challenge.strict_inputs
  );
};

export const retrieveAll = (query, user) => {
  if (user.role != 'ADMIN') {
    if (!query.filter) query.filter = {};
    query.filter.user = user._id;
  }
  return submissionRepository.findAll(query);
};

export const grade = async (submissionId, { score, automatically_graded: automated }, user) => {
  const submission = await submissionRepository.findById(submissionId);
  if (!submission) throw new createError(422, 'Invalid submission ID');
  const maxScore = await challengeRepository.getMaxScore(submission.challenge.toString());

  score ??= maxScore;

  if (score < 0) throw new createError(422, 'Score must be greater than or equal to 0');
  else if (maxScore < score)
    throw new createError(422, 'Score must be less than or equal to the max score for the challenge');
  await submissionRepository.insertGrade(submissionId, score, !!automated, user?._id);
};
