import asyncHandler from '../middleware/async'
import { createSubmission, viewSubmissions, gradeSubmission } from '../services/submission'
import { makeResponse } from '../utils/response'

export const create = asyncHandler(async (req, res) => {
  const submissionsDisabled = Date.now() > 1664616600000 // 2022 October 1st 3:00 PM
  if (submissionsDisabled) {
    return makeResponse({ res, status: 400, message: 'Submission period has expired' })
  }
  const ret = await createSubmission(req.body, req.user)
  if (ret) return makeResponse({ res, ...ret })
  return makeResponse({ res, status: 201, message: 'Submission added successfully ' })
})

export const view = asyncHandler(async (req, res) => {
  const data = await viewSubmissions(req.query, req.user)
  return makeResponse({ res, status: 200, data, message: 'Submissions retrieved successfully' })
})

export const grade = asyncHandler(async (req, res) => {
  const ret = await gradeSubmission(req.params.id, req.body, req.user)
  if (typeof ret === 'object') return makeResponse({ res, ...ret })
  else return makeResponse({ res, status: 200, message: 'Submission graded successfully' })
})
