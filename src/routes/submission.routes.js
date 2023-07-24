import { tracedAsyncHandler } from '@sliit-foss/functions';
import express from 'express';
import { Segments, celebrate } from 'celebrate';
import { submissionCreateSchema, submissionIdSchema, submissionViewSchema } from '@/validations/submission';
import { create, grade, view } from '@/controllers/submission';
import { adminProtect } from '@/middleware/auth';

const submissionRouter = express.Router();

submissionRouter.post('/', celebrate({ [Segments.BODY]: submissionCreateSchema }), tracedAsyncHandler(create));
submissionRouter.get('/', celebrate({ [Segments.QUERY]: submissionViewSchema }), tracedAsyncHandler(view));
submissionRouter.put(
  '/:id',
  celebrate({ [Segments.PARAMS]: submissionIdSchema }),
  adminProtect,
  tracedAsyncHandler(grade)
);

export default submissionRouter;
