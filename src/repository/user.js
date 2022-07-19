import User from '../models/user'

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

export const getAllUsers = async (req, res) => {
  return await User.find({})
}

export const getUserByID = async () => {}
