import asyncHandler from "../middleware/async";
import { createSubmission } from "../services/submission";
import { makeResponse } from "../utils/response"

export const create = asyncHandler(async(req, res, next) => {
    await createSubmission(req.body)

    makeResponse({ res, status: 200, data: {}, message: "submission created" })
})