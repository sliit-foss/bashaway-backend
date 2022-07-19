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

export const getAllUsers = async ({ sort = {}, filters = {}, pageNum = 1, pageSize = 10 }) => {
  const options = {
    sort,
    page: pageNum,
    limit: pageSize,
    collation: {
      locale: 'en',
    },
  }

  return await User.paginate(filters, options).catch((err) => {
    logger.error(`An error occurred when retrieving users - err: ${err.message}`)
    throw err
  })
}

export const getUserById = async (id) => {
  return User.findOne({ _id: id })
}
