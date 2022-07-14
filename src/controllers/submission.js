import asyncHandler from '../middleware/async'
import { createSubmission, viewSubmissions, gradeSubmission } from '../services/submission'
import { makeResponse } from '../utils/response'

export const create = asyncHandler(async (req, res, next) => {
  await createSubmission(req.body)

  makeResponse({ res, status: 201, message: 'submission created' })
})

export const view = asyncHandler(async (req, res, next) => {
  const data = await viewSubmissions(req.query)

  makeResponse({ res, status: 200, data, message: 'submissions retrieved' })
})

export const grade = asyncHandler(async (req, res, next) => {
  await gradeSubmission(req.body)

  makeResponse({ res, status: 201, message: 'submission graded' })
})
