import User from "../models/user";

export const createUser = async (user) => {
    
    return await new User(user).save();
}
