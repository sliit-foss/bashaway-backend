import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { ROLE } from '@/constants';
import {
  createNewQuestion,
  deleteOldQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion
} from '@/controllers/question';
import { roleProtect } from '@/middleware/auth';
import { addQuestionSchema, questionIdSchema, updateQuestionSchema } from '@/validations/question';

const questions = express.Router();

questions.get('/', tracedAsyncHandler(getAllQuestions));
questions.post(
  '/',
  celebrate({ [Segments.BODY]: addQuestionSchema }),
  roleProtect([ROLE.ADMIN]),
  tracedAsyncHandler(createNewQuestion)
);
questions.get('/:question_id', celebrate({ [Segments.PARAMS]: questionIdSchema }), tracedAsyncHandler(getQuestionById));
questions.patch(
  '/:question_id',
  celebrate({ [Segments.PARAMS]: questionIdSchema, [Segments.BODY]: updateQuestionSchema }),
  roleProtect([ROLE.ADMIN]),
  tracedAsyncHandler(updateQuestion)
);
questions.delete(
  '/:question_id',
  celebrate({ [Segments.PARAMS]: questionIdSchema }),
  roleProtect([ROLE.ADMIN]),
  tracedAsyncHandler(deleteOldQuestion)
);

export default questions;
