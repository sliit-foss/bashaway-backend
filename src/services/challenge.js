import createError from 'http-errors';
import { attachSubmissionAttributesToChallenge } from '@/helpers';
import * as challengeRepository from '@/repository/challenge';
import { getDistinctSubmissions, getOneSubmission } from '@/repository/submission';

export const retrieveAll = async (user, query) => {
  const result = await challengeRepository.findAll(user, query);
  await Promise.all(
    (query.page ? result.docs : result).map((challenge) => {
      return attachSubmissionAttributesToChallenge(challenge, user);
    })
  );
  return result;
};

export const create = (data, user) => challengeRepository.insertOne({ ...data, creator: user._id });

export const retrieve = async (challenge_id, user) => {
  const result = await challengeRepository.findById(challenge_id, user);
  if (!result)
    throw new createError(404, "Challenge doesn't exist or you do not have permission to view this challenge");
  return attachSubmissionAttributesToChallenge(result, user);
};

export const update = async (challenge_id, data, user) => {
  const challenge = await challengeRepository.findOne({ _id: challenge_id });
  if (!challenge) throw new createError(400, "Challenge doesn't exist to update");
  if (data.name) {
    const check = await challengeRepository.findOne({ name: data.name });
    if (check && check._id?.toString() !== challenge_id?.toString())
      throw new createError(400, 'Challenge name already taken');
  }
  if (challenge.creator_lock && challenge.creator.toString() !== user._id.toString())
    throw new createError(403, 'You are not authorized to update this challenge');
  if (data.max_score && data.max_score !== challenge.max_score) {
    const submissionCount = (await getDistinctSubmissions(challenge_id)).length;
    if (submissionCount > 0) throw new createError(400, 'Cannot update a challenge with submissions');
  }
  return challengeRepository.findAndUpdate({ _id: challenge_id }, data);
};

export const deleteOne = async (challenge_id, user) => {
  const challenge = await challengeRepository.findOne({ _id: challenge_id });
  if (!challenge) throw new createError(400, "Challenge doesn't exist to remove");
  if (challenge.enabled) {
    throw new createError(400, 'Failed to delete challenge as it is activated');
  }
  const checkSubmission = await getOneSubmission({ challenge: challenge_id });
  if (checkSubmission) {
    throw new createError(400, 'Failed to delete challenge as it has a submission');
  }
  if (challenge.creator_lock && challenge.creator.toString() !== user._id.toString())
    throw new createError(403, 'You are not authorized to delete this challenge');
  return challengeRepository.deleteById(challenge_id);
};
