import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { ROLE } from '@/constants';
import { create, grade, view } from '@/controllers/submission';
import { roleProtect } from '@/middleware/auth';
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
  roleProtect([ROLE.ADMIN]),
  tracedAsyncHandler(grade)
);

export default submissions;
