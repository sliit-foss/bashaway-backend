import createError from 'http-errors';
import { payments } from '@/models/ticket';
import * as ticketRepository from '@/repository/ticket';
import { statusCodeMap } from './payhere/util';

export const paymentStatusHandler = async (payload) => {
  const ticket = await ticketRepository.findByReference(payload.order_id);
  if (ticket && ticket.payment_status !== payments.success) {
    return ticketRepository.updateById(ticket._id, { payment_status: statusCodeMap[payload.status_code.toString()] });
  }
  throw new createError(404, 'Ticket not found');
};
