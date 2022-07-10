import Group from "../models/group"

export const create = (group) => Group.create(group)

export const findOne = (query) => Group.findOne(query)

export const findByMember = (memberId) => Group.aggregate([
    { $match: { members: { $elemMatch: { $eq: memberId } } } },
    { $lookup: { from: "users", localField: "admin", foreignField: "_id", as: "admin" } },
    { $unwind: "$members" },
    { $lookup: { from: "users", localField: "members", foreignField: "_id", as: "members" } },
    {
        $group:{
            _id: "$_id",
            itemsSold: { $push:  { members: "$members" } }
          }
    }
])