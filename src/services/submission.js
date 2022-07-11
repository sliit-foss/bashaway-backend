import { insertSubmission } from "../repository/submission"

export const createSubmission = async (reqBody) => {
    const { question, link } = reqBody;

    // TODO: getting user's id
    const user = "123456789012345678901234";
    // dummy value added

    await insertSubmission(user, question, link);
}