import * as challengeService from '@/services/challenge';
import { makeResponse } from '@/utils/response';

export const getAllChallenges = async (req, res) => {
  const data = await challengeService.retrieveAll(req.user, req.query);
  return makeResponse({ res, data, message: 'Challenges retrieved successfully' });
};

export const createChallenge = async (req, res) => {
  await challengeService.create(req.body, req.user);
  return makeResponse({ res, message: 'Challenge added successfully' });
};

export const getChallengeById = async (req, res) => {
  const result = await challengeService.retrieve(req.params.challenge_id, req.user);
  return makeResponse({ res, data: result, message: 'Challenge retrieved successfully' });
};

export const updateChallenge = async (req, res) => {
  await challengeService.update(req.params.challenge_id, req.body, req.user);
  return makeResponse({ res, message: 'Challenge updated successfully' });
};

export const deleteChallenge = async (req, res) => {
  await challengeService.deleteOne(req.params.challenge_id, req.user);
  return makeResponse({ res, message: 'Challenge deleted successfully' });
};
