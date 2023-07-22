import express from 'express';
import { getQuestionSubmission, getRegistrationInfo } from '@/controllers/dashboard';

const dashboardRouter = express.Router();

dashboardRouter.get('/submissions', getQuestionSubmission);
dashboardRouter.get('/registrations', getRegistrationInfo);

export default dashboardRouter;
