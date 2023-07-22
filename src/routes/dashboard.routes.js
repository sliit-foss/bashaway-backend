import { tracedAsyncHandler } from '@sliit-foss/functions';
import express from 'express';
import { getQuestionSubmission, getRegistrationInfo } from '@/controllers/dashboard';

const dashboardRouter = express.Router();

dashboardRouter.get('/submissions', tracedAsyncHandler(getQuestionSubmission));
dashboardRouter.get('/registrations', tracedAsyncHandler(getRegistrationInfo));

export default dashboardRouter;
