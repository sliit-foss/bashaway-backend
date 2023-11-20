import { PAYHERE } from '@/config';
import { payments } from '@/models/ticket';
import { md5 } from '@/utils';

export const generateHash = (reference, amount, currency = 'LKR') => {
  return md5(
    PAYHERE.MERCHANT_ID + reference + amount.toFixed(2) + currency + md5(PAYHERE.MERCHANT_SECRET).toUpperCase()
  ).toUpperCase();
};

export const webhookSignature = (orderId, amount, currency, statusCode) =>
  md5(
    PAYHERE.MERCHANT_ID + orderId + amount + currency + statusCode + md5(PAYHERE.MERCHANT_SECRET).toUpperCase()
  ).toUpperCase();

export const statusMap = {
  RECEIVED: payments.success,
  REFUNDED: payments.refunded,
  CHARGEBACKED: payments.chargebacked
};

export const statusCodeMap = {
  '2': payments.success,
  '0': payments.pending,
  '-1': payments.cancelled,
  '-2': payments.failed,
  '-3': payments.chargebacked
};
