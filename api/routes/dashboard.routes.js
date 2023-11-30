import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { getQuestionSubmissions, getRegistrationInfo, getTeamSubmissions } from '@/controllers/dashboard';
import { analyticsQuerySchema } from '@/validations/analytics';

const dashboard = express.Router();

dashboard.get(
  '/submissions',
  celebrate({ [Segments.QUERY]: analyticsQuerySchema }),
  tracedAsyncHandler(getQuestionSubmissions)
);
dashboard.get(
  '/submissions/team',
  celebrate({ [Segments.QUERY]: analyticsQuerySchema }),
  tracedAsyncHandler(getTeamSubmissions)
);
dashboard.get(
  '/registrations',
  celebrate({ [Segments.QUERY]: analyticsQuerySchema }),
  tracedAsyncHandler(getRegistrationInfo)
);

export default dashboard;
