import { dot } from 'dot-object';
import mongoose from 'mongoose';
import { Event } from '@/models';
import { roles } from '@/models/user';
import { eventFilters } from './util';

export const findAll = (user, query = {}) => {
  const filter = eventFilters(user, query.filter);
  const pipeline = [
    {
      $match: filter
    },
    {
      $lookup: {
        from: 'speakers',
        localField: 'speakers',
        foreignField: '_id',
        as: 'speakers',
        pipeline: [
          {
            $project: {
              created_at: 0,
              updated_at: 0,
              __v: 0
            }
          }
        ]
      }
    },
    ...(user?.role === roles.entrant
      ? [
          {
            $lookup: {
              from: 'tickets',
              localField: '_id',
              foreignField: 'event',
              as: 'ticket',
              pipeline: [
                {
                  $match: {
                    owner: mongoose.Types.ObjectId(user?._id)
                  }
                },
                {
                  $project: {
                    _id: 1,
                    approved: 1,
                    utilized: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              ticket: {
                $arrayElemAt: ['$ticket', 0]
              }
            }
          }
        ]
      : []),
    {
      $sort: query.sort
    },
    {
      $project: {
        creator: 0,
        creator_lock: 0
      }
    }
  ];
  const aggregate = Event.aggregate(pipeline);
  return !query.page
    ? aggregate
    : Event.aggregatePaginate(aggregate, {
        page: query.page,
        limit: query.limit
      });
};

export const insertOne = (data) => Event.create(data);

export const findOne = (filters) => Event.findOne(filters).lean();

export const findById = (id, user, filterFields = true) => {
  const baseFilters = { _id: id };
  let query = Event.findOne(eventFilters(user, baseFilters)).lean();
  if (filterFields) query = query.select('-creator_lock');
  return query.exec();
};

export const findOneAndUpdate = (filters, data) => Event.findOneAndUpdate(filters, dot(data), { new: true });

export const updateById = (id, data) => findOneAndUpdate({ _id: id }, data);

export const deleteById = (id) => Event.deleteOne({ _id: id });
