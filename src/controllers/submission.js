import asyncHandler from "../middleware/async";
import { createSubmission, viewAllSubmissions } from "../services/submission";
import { makeResponse } from "../utils/response"

export const create = asyncHandler(async(req, res, next) => {
    await createSubmission(req.body)

    makeResponse({ res, status: 200, data: {}, message: "submission created" })
})

export const viewAll = asyncHandler(async (req, res, next) => {
    const data = await viewAllSubmissions(req)

    console.log(req.query);
    makeResponse({ res, status: 200, data, message: "submissions retrieved" })
})
