import User from '../models/user'
import logger from '../utils/logger'

export const createUser = async (user) => {
  return await new User(user).save()
}

export const getOneUser = async (filters, returnPassword) => {
  const user = JSON.parse(JSON.stringify(await User.findOne(filters)))
  if (!returnPassword) delete user.password
  return user
}

export const findOneAndUpdateUser = async (filters, data) => {
  const user = await User.findOneAndUpdate(filters, data, { new: true })
  delete user.password
  return user
}

export const getAllUsers = async ({ sort = {}, filter = {}, pageNum = 1, pageSize = 10 }) => {
  const options = {
    page: pageNum,
    limit: pageSize,
    collation: {
      locale: 'en',
    },
  }

  if (Object.keys(sort).length > 0) options.sort = sort

  if (filter.member_count) {
    filter.members = { $size: Number(filter.member_count) }
    delete filter.member_count
  }

  return await User.aggregatePaginate(User.aggregate([{
    $match: filter,
  }, { $unset: ["password", "verification_code"] }]), options).catch((err) => {
    logger.error(`An error occurred when retrieving users - err: ${err.message}`)
    throw err
  })
}

export const getUserById = async (id) => {
  return User.findOne({ _id: id })
}
