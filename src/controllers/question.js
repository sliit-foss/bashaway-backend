import asyncHandler from '../middleware/async'
import { createQuestion, retrieveQuestion} from '../services/question'
import { makeResponse } from '../utils/response'

export const createNewQuestion = asyncHandler(async (req, res) => {
    const result = await createQuestion(req.body, req.user);
    if (!result) return makeResponse({ res, status: 500, message: "Failed to add question" });
    if (result.status) return makeResponse({ res, ...result });
    return makeResponse({ res, message: "Question added successfully" });
})

export const getQuestionById = asyncHandler(async (req, res) => {
    const data = await retrieveQuestion(req.params.question_id)
    return makeResponse({ res, data, message: 'Question retrieved successfully'})
})



