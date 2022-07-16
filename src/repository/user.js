import User from '../models/user'

export const createUser = async (user) => {
  return await new User(user).save()
}

export const getOneUser = async (filters) => {
  return User.findOne(filters);
}

export const findOneAndUpdateUser = async (filters, data) => {
    return User.findOneAndUpdate(filters, data, { new: true });
}
