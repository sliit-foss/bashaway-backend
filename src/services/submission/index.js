import crypto from 'crypto';
import createError from 'http-errors';
import { discountPercentages } from '@/models/coupon';
import * as challengeRepository from '@/repository/challenge';
import * as couponRepository from '@/repository/coupon';
import * as submissionRepository from '@/repository/submission';
import { triggerScorekeeper as initiateTesting } from '../github';
import { sendCouponEmail } from './util';

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
  if (user.role != 'SuperAdmin') {
    if (!query.filter) query.filter = {};
    query.filter.user = user._id;
  }
  return submissionRepository.findAll(query);
};

export const grade = async (submissionId, { score, automatically_graded: automated }, user) => {
  const submission = await submissionRepository.findWithUserAndChallenge(submissionId);
  if (!submission) throw new createError(422, 'Invalid submission ID');

  score ??= submission.challenge.max_score;

  if (score < 0) throw new createError(422, 'Score must be greater than or equal to 0');
  else if (submission.challenge.max_score < score)
    throw new createError(422, 'Score must be less than or equal to the max score for the challenge');

  const existingCoupon = await couponRepository.findOne({ challenge: submission.challenge._id });

  const updateScore = () => submissionRepository.updateScore(submissionId, score, !!automated, user?._id);

  if (existingCoupon) return updateScore();

  const scorePercentage = (score / submission.challenge.max_score) * 100;

  if (scorePercentage >= 50) {
    const couponCode = crypto.randomUUID();
    await Promise.all([
      updateScore(),
      couponRepository
        .insertOne({
          discount_percentage: discountPercentages[submission.challenge.difficulty],
          code: couponCode,
          challenge: submission.challenge._id
        })
        .then(() => {
          sendCouponEmail(
            submission.user.email,
            submission.user.name,
            couponCode,
            discountPercentages[submission.challenge.difficulty],
            submission.challenge.event
          );
        })
    ]);
  }
};
