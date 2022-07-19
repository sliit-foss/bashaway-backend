import asyncHandler from '../middleware/async'
import { createQuestion } from '../services/question'
import { makeResponse } from '../utils/response'

export const createNewQuestion = asyncHandler(async (req, res) => {
    await createQuestion(req.body, req.user)
    makeResponse({ res, status: 200, message: 'Question added successfully'})
})
