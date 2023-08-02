import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { create, grade, view } from '@/controllers/submission';
import { adminProtect } from '@/middleware/auth';
import {
  submissionCreateSchema,
  submissionIdSchema,
  submissionUpdateSchema,
  submissionViewSchema
} from '@/validations/submission';

const submissionRouter = express.Router();

submissionRouter.post('/', celebrate({ [Segments.BODY]: submissionCreateSchema }), tracedAsyncHandler(create));
submissionRouter.get('/', celebrate({ [Segments.QUERY]: submissionViewSchema }), tracedAsyncHandler(view));
submissionRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: submissionIdSchema,
    [Segments.BODY]: submissionUpdateSchema
  }),
  adminProtect,
  tracedAsyncHandler(grade)
);

export default submissionRouter;
