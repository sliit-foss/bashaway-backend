import User from '../models/user'

export const createUser = async (user) => {
  return await new User(user).save()
}

export const getOneUser = async (filters, returnPassword) => {
  const userModel = await User.findOne(filters)
  if (!userModel) return null
  const user = JSON.parse(JSON.stringify(userModel))
  if (!returnPassword) delete user.password
  return user
}

export const findOneAndUpdateUser = async (filters, data) => {
  const userModel = await User.findOneAndUpdate(filters, data, { new: true })
  if (!userModel) return null

  const user = JSON.parse(JSON.stringify(userModel))
  delete user.password
  return user
}