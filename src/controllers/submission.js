import asyncHandler from "../middleware/async";
import { createSubmission } from "../services/submission";
import { makeResponse } from "../utils/response"

export const create = asyncHandler(async(req, res, next) => {
    await createSubmission(req)

    makeResponse({ res, status: 200, data: {}, message: "submission created" })
})