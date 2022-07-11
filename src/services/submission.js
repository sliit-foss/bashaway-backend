import { insertSubmission, getAllSubmissions } from "../repository/submission"

export const createSubmission = async (reqBody) => {
    const { question, link } = reqBody;

    // TODO: getting user's id
    const user = "123456789012345678901234";
    // dummy value added

    await insertSubmission(user, question, link);
}

export const viewAllSubmissions = async (req) => {
    const filters = req.query.filter;
    const pageNum = 1;
    const pageSize = 1;

    return await getAllSubmissions(filters, pageNum, pageSize)
}