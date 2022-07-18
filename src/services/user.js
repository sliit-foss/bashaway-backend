import { findByIdAndUpdateUser } from "../repository/user"

export const getUpdate = async (user , reqBody) => {

    await findByIdAndUpdateUser(user._id, reqBody);
}