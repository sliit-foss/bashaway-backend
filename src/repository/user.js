import User from "../models/user";


export const createUser = async (user) => {
    return await new User(user).save();
}


export const findByIdAndUpdateUser = async (user, data ) => {

    return await User.findByIdAndUpdate(user, data );
}
