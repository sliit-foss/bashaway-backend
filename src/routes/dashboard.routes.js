import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { getQuestionSubmissions, getRegistrationInfo, getTeamSubmissions } from '@/controllers/dashboard';

const dashboard = express.Router();

dashboard.get('/submissions', tracedAsyncHandler(getQuestionSubmissions));
dashboard.get('/submissions/team', tracedAsyncHandler(getTeamSubmissions));
dashboard.get('/registrations', tracedAsyncHandler(getRegistrationInfo));

export default dashboard;
