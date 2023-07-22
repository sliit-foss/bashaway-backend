import { create, grade, view } from '../controllers/submission';
import { adminProtect } from '../middleware/auth';
import { submissionCreateSchema, submissionIdSchema, submissionViewSchema } from '../validations/submission';
import { Segments, celebrate } from 'celebrate';
import express from 'express';

const submissionRouter = express.Router();

submissionRouter.post('/', celebrate({ [Segments.BODY]: submissionCreateSchema }), create);
submissionRouter.get('/', celebrate({ [Segments.QUERY]: submissionViewSchema }), view);
submissionRouter.put('/:id', celebrate({ [Segments.PARAMS]: submissionIdSchema }), adminProtect, grade);

export default submissionRouter;
