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

const submissions = express.Router();

submissions.post('/', celebrate({ [Segments.BODY]: submissionCreateSchema }), tracedAsyncHandler(create));
submissions.get('/', celebrate({ [Segments.QUERY]: submissionViewSchema }), tracedAsyncHandler(view));
submissions.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: submissionIdSchema,
    [Segments.BODY]: submissionUpdateSchema
  }),
  adminProtect,
  tracedAsyncHandler(grade)
);

export default submissions;
