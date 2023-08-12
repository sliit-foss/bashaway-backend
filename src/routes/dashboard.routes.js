import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { getQuestionSubmission, getRegistrationInfo } from '@/controllers/dashboard';

const dashboard = express.Router();

dashboard.get('/submissions', tracedAsyncHandler(getQuestionSubmission));
dashboard.get('/registrations', tracedAsyncHandler(getRegistrationInfo));

export default dashboard;
