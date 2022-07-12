import User from "../models/user";


export const createUser = async (user) => {
    return await new User(user).save();
}


export const insertUpdate = async (user, data ) => {

    return await User.findByIdAndUpdate(user, data );
}
