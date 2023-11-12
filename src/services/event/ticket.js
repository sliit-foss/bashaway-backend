import crypto from 'crypto';
import { default as createError } from 'http-errors';
import * as ticketRepository from '@/repository/ticket';
import { retrieve } from '.';

export const requestTicket = async (event_id, data, user) => {
  const event = await retrieve(event_id, user);
  if (data.survey_answers.length !== event.survey.length) {
    throw new createError(400, 'All survey questions must be answered');
  }
  let approved = false;
  if (event.settings.automatic_approval) {
    approved = true;
  }
  const reference = crypto.randomUUID();
  const survey = data.survey_answers.map((answer, index) => ({ question: event.survey[index], answer }));
  return ticketRepository.insertOne({ cost: 0, event: event_id, owner: user._id, approved, survey, reference });
};

export const getUserTicket = async (user) => {
  const ticket = await ticketRepository.findOne({ owner: user._id }, true);
  if (!ticket) throw new createError(404, "You haven't requested a ticket for this event");
  return ticket;
};

export const approveTicket = async (ticket_id, user) => {
  const ticket = await ticketRepository.findWithApprovedUser(ticket_id);
  if (!ticket) throw new createError(404, "Ticket doesn't exist");
  if (ticket.approved_by)
    throw new createError(
      400,
      `This ticket is already approved by ${
        user._id.toString() === ticket.approved_by._id.toString() ? 'you' : ticket.approved_by.name
      }`
    );
  return ticketRepository.updateById(ticket_id, { approved: true, approved_by: user._id });
};
