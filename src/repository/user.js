import User from "../models/user";

const createUser = async (user) => {
    
    return await new User(user).save();
}

module.exports = {
    createUser,
}