import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { handlePayment } from '@/controllers/webhook';

const webhooks = express.Router();

webhooks.post('/payments', tracedAsyncHandler(handlePayment));

export default webhooks;
