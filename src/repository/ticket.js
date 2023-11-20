import createError from 'http-errors';
import { omit } from 'lodash';
import mongoose from 'mongoose';
import Ticket, { payments } from '@/models/ticket';

export const findAll = (user, query = {}) => {
  const options = {
    select: '-creator -creator_lock',
    lean: true,
    sort: query.sort,
    page: query.page,
    limit: query.limit
  };
  return !query.page ? Ticket.find(query.filter).sort(options.sort).lean() : Ticket.paginate(query.filter, options);
};

export const insertOne = (data) => Ticket.create(data);

export const findOne = (filters, filterFields = false) => {
  let query = Ticket.findOne(filters).lean();
  if (filterFields) query = query.select('-approved_by');
  return query.exec();
};

export const findById = async (id, throwError = false) => {
  const ticket = await Ticket.findById(id).lean();
  if (!ticket && throwError) throw new createError(404, "Ticket doesn't exist");
};

export const findByReference = (reference) => Ticket.findOne({ reference }).lean();

export const findWithApprovedUser = (id) => Ticket.findById(id).populate('approved_by').lean();

export const findOneAndUpdate = (filters, data) => Ticket.findOneAndUpdate(filters, data, { new: true });

export const updateById = (id, data) => findOneAndUpdate({ _id: id }, data);

export const deleteById = (id) => Ticket.deleteOne({ _id: id });

export const getPremiumTicketCount = (eventId) =>
  Ticket.countDocuments({ event: eventId, premium: true, payment_status: payments.success }).lean();

export const getPaidTicketCount = (eventId) =>
  Ticket.countDocuments({ event: eventId, payment_status: payments.success }).lean();

export const getTicketStats = async (eventId) => {
  const pipeline = [
    {
      $group: {
        _id: '1',
        total: { $sum: 1 },
        approved_count: { $sum: { $cond: [{ $eq: ['$approved', true] }, 1, 0] } },
        transferred_count: { $sum: { $cond: [{ $eq: ['$transferred', true] }, 1, 0] } },
        utilized_count: { $sum: { $cond: [{ $eq: ['$utilized', true] }, 1, 0] } },
        premium_count: { $sum: { $cond: [{ $eq: ['$premium', true] }, 1, 0] } },
        unpaid: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$approved', true] }, { $eq: ['$payment_status', payments.pending] }] }, 1, 0]
          }
        },
        successfully_paid: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$approved', true] }, { $eq: ['$payment_status', payments.success] }] }, 1, 0]
          }
        },
        failed_to_pay: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$approved', true] }, { $eq: ['$payment_status', payments.failed] }] }, 1, 0]
          }
        },
        processed_monetary_value: { $sum: { $cond: [{ $eq: ['$payment_status', payments.success] }, '$cost', 0] } }
      }
    }
  ];
  if (eventId) pipeline.unshift({ $match: { event: mongoose.Types.ObjectId(eventId) } });
  const results = await Ticket.aggregate(pipeline);
  return omit(results[0], ['_id']);
};
