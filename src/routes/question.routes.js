import { addQuestionSchema, questionIdSchema, updateQuestionSchema } from '@/validations/question';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import express from 'express';
import { Segments, celebrate } from 'celebrate';
import {
  createNewQuestion,
  deleteOldQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion
} from '@/controllers/question';
import { adminProtect } from '@/middleware/auth';

const questionRouter = express.Router();

questionRouter.get('/', tracedAsyncHandler(getAllQuestions));
questionRouter.post(
  '/',
  celebrate({ [Segments.BODY]: addQuestionSchema }),
  adminProtect,
  tracedAsyncHandler(createNewQuestion)
);
questionRouter.get(
  '/:question_id',
  celebrate({ [Segments.PARAMS]: questionIdSchema }),
  tracedAsyncHandler(getQuestionById)
);
questionRouter.put(
  '/:question_id',
  celebrate({ [Segments.PARAMS]: questionIdSchema, [Segments.BODY]: updateQuestionSchema }),
  adminProtect,
  tracedAsyncHandler(updateQuestion)
);
questionRouter.delete(
  '/:question_id',
  celebrate({ [Segments.PARAMS]: questionIdSchema }),
  adminProtect,
  tracedAsyncHandler(deleteOldQuestion)
);

export default questionRouter;
