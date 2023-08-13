import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import {
  createNewQuestion,
  deleteOldQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion
} from '@/controllers/question';
import { adminProtect } from '@/middleware/auth';
import { addQuestionSchema, questionIdSchema, updateQuestionSchema } from '@/validations/question';

const questions = express.Router();

questions.get('/', tracedAsyncHandler(getAllQuestions));
questions.post(
  '/',
  celebrate({ [Segments.BODY]: addQuestionSchema }),
  adminProtect,
  tracedAsyncHandler(createNewQuestion)
);
questions.get('/:question_id', celebrate({ [Segments.PARAMS]: questionIdSchema }), tracedAsyncHandler(getQuestionById));
questions.patch(
  '/:question_id',
  celebrate({ [Segments.PARAMS]: questionIdSchema, [Segments.BODY]: updateQuestionSchema }),
  adminProtect,
  tracedAsyncHandler(updateQuestion)
);
questions.delete(
  '/:question_id',
  celebrate({ [Segments.PARAMS]: questionIdSchema }),
  adminProtect,
  tracedAsyncHandler(deleteOldQuestion)
);

export default questions;
