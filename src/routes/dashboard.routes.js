import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { getRegistrationInfo, getTicketInfo } from '@/controllers/dashboard';
import { eventIdSchema } from '@/validations/dashboard';

const dashboard = express.Router();

dashboard.get('/tickets', celebrate({ [Segments.QUERY]: eventIdSchema }), tracedAsyncHandler(getTicketInfo));
dashboard.get('/registrations', tracedAsyncHandler(getRegistrationInfo));

export default dashboard;
