import { insertUpdate } from "../repository/user"

export const getupdate = async (reqBody) => {

    // TODO: getting user's id
    const user = "62caa39ce74035797815abf7";

    // dummy value added

    await insertUpdate(user, reqBody);
}