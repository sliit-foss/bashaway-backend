import { default as createError } from 'http-errors';
import { webhookSignature } from '@/services/payhere/util';
import * as webhookService from '@/services/webhook';
import { makeResponse } from '@/utils/response';

export const handlePayment = async (req, res) => {
  if (
    req.body?.md5sig !==
    webhookSignature(req.body.order_id, req.body.payhere_amount, req.body.payhere_currency, req.body.status_code)
  ) {
    throw new createError(401, 'Invalid signature');
  }
  await webhookService.paymentStatusHandler(req.body);
  return makeResponse({ res, message: 'Webhook received successfully' });
};
