import crypto from 'crypto';
import { default as createError } from 'http-errors';
import { PAYHERE } from '@/config';
import { isProduction } from '@/constants';
import { payments } from '@/models/ticket';
import * as couponRepository from '@/repository/coupon';
import * as speakerRepository from '@/repository/speaker';
import * as ticketRepository from '@/repository/ticket';
import * as userRepository from '@/repository/user';
import * as payhere from '@/services/payhere';
import { retrieve } from '.';

export const requestTicket = async (event_id, data, user) => {
  const event = await retrieve(event_id, user);
  if (
    new Date() < new Date(event.settings.registration_start) ||
    new Date() > new Date(event.settings.registration_end)
  ) {
    throw new createError(400, 'Registration for this event is not open at the moment');
  }
  if (data.premium) {
    if (event.settings.payments?.premium_tickets?.enabled) {
      const premiumTicketCount = await ticketRepository.getPremiumTicketCount(event_id);
      if (premiumTicketCount >= event.settings.payments.premium_tickets.seats) {
        throw new createError(400, 'Premium tickets are sold out');
      }
    }
    throw new createError(400, 'Premium tickets are not available for this event');
  } else {
    if (data.survey_answers.length !== event.survey.length) {
      throw new createError(400, 'All survey questions must be answered');
    }
  }
  const approved = event.settings.automatic_approval || data.premium;
  const reference = crypto.randomUUID();
  const survey = data.survey_answers.map((answer, index) => ({ question: event.survey[index], answer }));
  return ticketRepository.insertOne({
    cost: 0,
    event: event_id,
    owner: user._id,
    approved,
    survey,
    reference,
    premium: data.premium
  });
};

export const getUserTicket = async (user) => {
  const ticket = await ticketRepository.findOne({ owner: user._id }, true);
  if (!ticket) throw new createError(404, "You haven't requested a ticket for this event");
  return ticket;
};

export const approveTicket = async (ticket_id, user) => {
  const ticket = await ticketRepository.findById(ticket_id, true);
  if (ticket.approved) throw new createError(400, `This ticket is already approved`);
  return ticketRepository.updateById(ticket_id, { approved: true, approved_by: user._id });
};

export const initiateTicketPayment = async (ticket_id, coupon_code, user) => {
  const [ticket, speaker] = await Promise.all([
    ticketRepository.findById(ticket_id, true),
    speakerRepository.findByEmail(user.email)
  ]);

  if (ticket.owner.toString() !== user._id.toString()) throw new createError(403, 'Ticket does not belong to you');

  if (ticket.payment_status === payments.success) return ticket;

  const event = await retrieve(ticket.event, user);

  const promises = [ticketRepository.getPaidTicketCount(ticket.event)];

  if (ticket.premium) promises.push(ticketRepository.getPremiumTicketCount(ticket.event));

  const [purchasedTicketCount, premiumTicketCount] = await Promise.all(promises);

  if (purchasedTicketCount >= event.seats) {
    throw new createError(400, 'House full');
  }

  if (ticket.premium) {
    if (premiumTicketCount >= event.settings.payments?.premium_tickets?.seats) {
      throw new createError(400, 'Premium tickets are sold out');
    }
  }

  let cost = ticket.premium ? event.settings.payments?.premium_tickets?.cost : event.settings.payments?.ticket_cost;

  if (speaker && event.settings.payments?.speaker_discount_percentage) {
    cost -= (cost * event.settings.payments?.speaker_discount_percentage) / 100;
  }

  let coupon = null;

  if (coupon_code) {
    if (!event.settings.payments?.allow_coupons) {
      throw new createError(400, 'Coupons are not allowed for this event');
    }
    coupon = await couponRepository.findByCode(coupon_code);
    if (!coupon) {
      throw new createError(400, 'Invalid coupon code');
    }
    if (coupon.ticket && coupon.ticket.payment_status === payments.success) {
      throw new createError(400, 'Coupon code is already used');
    }
    cost -= (cost * coupon.discount_percentage) / 100;
  }

  if (event.settings.payments?.early_bird_discount?.enabled) {
    if (new Date() < new Date(event.settings.payments.early_bird_discount.deadline)) {
      cost -= (cost * event.settings.payments.early_bird_discount.percentage) / 100;
    }
  }

  if (coupon) couponRepository.updateById(coupon._id, { ticket: ticket._id });

  if (cost === 0) {
    return ticketRepository.updateById(ticket._id, { cost: 0, payment_status: payments.success });
  }

  const updatedTicket = await ticketRepository.updateById(ticket._id, { cost, payment_status: payments.pending });

  return {
    ...updatedTicket,
    payhere_config: {
      hash: payhere.generateHash(ticket.reference, cost),
      merchant_id: PAYHERE.MERCHANT_ID,
      is_production: isProduction()
    }
  };
};

export const verifyTicketPayment = async (ticket_id, user) => {
  const ticket = await ticketRepository.findById(ticket_id, true);
  if (ticket.owner.toString() !== user._id.toString()) throw new createError(403, 'Ticket does not belong to you');
  if (ticket.payment_status === payments.success) return ticket;
  const res = await payhere.retrievePaymentDetails(ticket.reference);
  let paymentStatus = payments.failed;
  if (res.status === 1) {
    paymentStatus = payhere.statusMap[res.data?.[0]?.status] || payments.failed;
  }
  return ticketRepository.updateById(ticket_id, { payment_status: paymentStatus });
};

export const cancelTicketPayment = async (ticket_id, user) => {
  const ticket = await ticketRepository.findById(ticket_id, true);
  if (ticket.owner.toString() !== user._id.toString()) throw new createError(403, 'Ticket does not belong to you');
  if ([!payments.success, payments.refunded, payments.chargebacked].includes(ticket.payment_status)) {
    return ticketRepository.updateById(ticket_id, { payment_status: payments.cancelled });
  }
  return ticket;
};

export const transferTicket = async (ticket_id, email, user) => {
  const [ticket, transferrableUser] = await Promise.all([
    ticketRepository.findById(ticket_id, true),
    userRepository.findByEmail(email)
  ]);

  if (ticket.owner.toString() !== user._id.toString()) throw new createError(403, 'Ticket does not belong to you');

  if (!transferrableUser) throw new createError(400, 'User to transfer the ticket to is not registered');

  const event = await retrieve(ticket.event, user);

  if (!ticket.premium && !event.settings.ticket_transfer_enabled) {
    throw new createError(400, 'Ticket transfer is not allowed for this event');
  }

  const existingTicket = await ticketRepository.findOne({ owner: transferrableUser._id, event: ticket.event });
  if (existingTicket && existingTicket.payment_status === payments.success) {
    throw new createError(
      400,
      'User to transfer the ticket to already has a ticket for which the payment is successful'
    );
  }
  return ticketRepository.updateById(ticket_id, { owner: transferrableUser._id, transferred: true });
};
