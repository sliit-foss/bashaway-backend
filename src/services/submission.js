import { insertSubmission } from "../repository/submission"

export const createSubmission = async (req) => {
    const { question, link } = req.body;

    // TODO: getting user's group
    const group = "123456789012345678901234";
    // dummy value added

    await insertSubmission(group, question, link);
}