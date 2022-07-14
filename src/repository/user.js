import User from '../models/user'

export const createUser = async (user) => {
  return await new User(user).save()
}

export const getOneUser = async (filters) => {
  return User.findOne(filters);
}

export const insertScore = async (user, score) => {
  await User.findByIdAndUpdate(user, { score }, { upsert: true })
}

export const findOneAndUpdateUser = async (filters, data) => {
    return User.findOneAndUpdate(filters, data, { new: true });
}

export const updateVerifiedUser = async (user) => {
    return await User.findOneAndUpdate({email:user.email}, user);
}

export const getUserByCode = async (verification_code) => {
    return await User.findOne({verification_code:verification_code});
}
