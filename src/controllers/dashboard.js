import asyncHandler from '../middleware/async'
import { getAllQuestionsSubmissions } from '../services/dashboard'
import { makeResponse } from '../utils/response'

export const getQuestionSubmission = asyncHandler(async (req, res) => {
  const data = await getAllQuestionsSubmissions()
  return makeResponse({
    res,
    status: 200,
    data,
    message: 'Question submissions retrieved successfully'
  })
})
