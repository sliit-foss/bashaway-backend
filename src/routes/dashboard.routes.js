import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { getChallengeSubmissions, getRegistrationInfo, getTeamSubmissions } from '@/controllers/dashboard';

const dashboard = express.Router();

dashboard.get('/submissions', tracedAsyncHandler(getChallengeSubmissions));
dashboard.get('/submissions/team', tracedAsyncHandler(getTeamSubmissions));
dashboard.get('/registrations', tracedAsyncHandler(getRegistrationInfo));

export default dashboard;
