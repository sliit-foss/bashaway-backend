import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import {
  createChallenge,
  deleteChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge
} from '@/controllers/challenge';
import { adminProtect, protect } from '@/middleware/auth';
import { addChallengeSchema, challengeIdSchema, updateChallengeSchema } from '@/validations/challenge';

const challenges = express.Router();

challenges.get('/', tracedAsyncHandler(getAllChallenges));
challenges.post(
  '/',
  protect,
  adminProtect,
  celebrate({ [Segments.BODY]: addChallengeSchema }),
  tracedAsyncHandler(createChallenge)
);
challenges.get(
  '/:challenge_id',
  celebrate({ [Segments.PARAMS]: challengeIdSchema }),
  tracedAsyncHandler(getChallengeById)
);
challenges.patch(
  '/:challenge_id',
  protect,
  adminProtect,
  celebrate({ [Segments.PARAMS]: challengeIdSchema, [Segments.BODY]: updateChallengeSchema }),
  tracedAsyncHandler(updateChallenge)
);
challenges.delete(
  '/:challenge_id',
  protect,
  adminProtect,
  celebrate({ [Segments.PARAMS]: challengeIdSchema }),
  tracedAsyncHandler(deleteChallenge)
);

export default challenges;
