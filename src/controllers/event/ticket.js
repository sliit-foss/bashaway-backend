import { default as createError } from 'http-errors';
import * as eventService from '@/services/event';
import { makeResponse } from '@/utils/response';

export const requestEventTicket = async (req, res) => {
  const ticket = await eventService.requestTicket(req.params.event_id, req.body, req.user);
  return makeResponse({ res, data: ticket, message: 'Event ticket requested successfully' });
};

export const getUserEventTicket = async (req, res) => {
  const ticket = await eventService.getUserTicket(req.user);
  return makeResponse({ res, data: ticket, message: 'User ticket retrieved successfully' });
};

export const approveUserTicket = async (req, res) => {
  await eventService.approveTicket(req.params.ticket_id, req.user);
  return makeResponse({ res, message: 'User ticket approved successfully' });
};

export const initiateTicketPayment = async (req, res) => {
  const ticket = await eventService.initiateTicketPayment(req.params.ticket_id, req.body.coupon_code, req.user);
  return makeResponse({ res, data: ticket, message: 'Ticket payment initiated successfully' });
};

export const verifyTicketPayment = async (req, res) => {
  const ticket = await eventService.verifyTicketPayment(req.params.ticket_id, req.user);
  return makeResponse({ res, data: ticket, message: 'Ticket payment verified successfully' });
};

export const cancelTicketPayment = async (req, res) => {
  await eventService.cancelTicketPayment(req.params.ticket_id, req.user);
  return makeResponse({ res, message: 'Ticket payment cancelled successfully' });
};

export const transferTicket = async (req, res) => {
  if (req.body.email === req.user.email) {
    throw new createError(400, 'You cannot transfer your ticket to yourself');
  }
  await eventService.transferTicket(req.params.ticket_id, req.body.email, req.user);
  return makeResponse({ res, message: 'Ticket transferred successfully' });
};
