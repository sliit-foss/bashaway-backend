import asyncHandler from '../middleware/async'
import { getAllQuestionsSubmissions, getRegistrations } from '../services/dashboard'
import { makeResponse } from '../utils/response'

export const getQuestionSubmission = asyncHandler(async (req, res) => {
  const data = await getAllQuestionsSubmissions(req.user)
  return makeResponse({
    res,
    status: 200,
    data,
    message: 'Question submissions retrieved successfully'
  })
})

export const getRegistrationInfo = asyncHandler(async (req, res) => {
  const data = await getRegistrations()
  return makeResponse({
    res,
    status: 200,
    data,
    message: 'Registration info retrieved successfully'
  })
})
