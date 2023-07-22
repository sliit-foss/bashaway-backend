import { getQuestionSubmission, getRegistrationInfo } from '../controllers/dashboard';
import express from 'express';

const dashboardRouter = express.Router();

dashboardRouter.get('/submissions', getQuestionSubmission);
dashboardRouter.get('/registrations', getRegistrationInfo);

export default dashboardRouter;
