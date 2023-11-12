import Ticket from '@/models/ticket';

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

export const findOne = (filters) => Ticket.findOne(filters).lean();

export const findById = (id) => Ticket.findById(id).lean();

export const findOneAndUpdate = (filters, data) => Ticket.findOneAndUpdate(filters, data, { new: true });

export const deleteById = (id) => Ticket.deleteOne({ _id: id });
