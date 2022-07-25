import asyncHandler from '../middleware/async'
import { createSubmission, viewSubmissions, gradeSubmission } from '../services/submission'
import { makeResponse } from '../utils/response'

export const create = asyncHandler(async (req, res) => {
  await createSubmission(req.body, req.user)
  makeResponse({ res, status: 201, message: 'Submission added successfully ' })
})

export const view = asyncHandler(async (req, res) => {
  const data = await viewSubmissions(req.query)
  return makeResponse({ res, status: 200, data, message: 'Submissions retrieved successfully' })
})

export const grade = asyncHandler(async (req, res) => {
  const ret = await gradeSubmission(req.params.id, req.body, req.user)
  if (typeof ret === 'object')
    return makeResponse({ res, ...ret })
  else
    return makeResponse({ res, status: 200, message: 'Submission graded successfully' })
})
