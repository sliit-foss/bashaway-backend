import User from '../models/user'


export const createUser = async (user) => {
  return await new User(user).save()
}

export const getOneUser = async (filters, returnPassword) => {
  const user = await User.findOne(filters).lean()
  if (!user) return null

  if (!returnPassword) delete user.password
  return user
}

export const findOneAndUpdateUser = async (filters, data) => {
  const user = await User.findOneAndUpdate(filters, data, { new: true }).lean()
  if (!user) return null

  delete user.password
  return user
}

export const findOneAndRemoveUser = async (userData) => {
  User.findOneAndRemove(userData)
}
