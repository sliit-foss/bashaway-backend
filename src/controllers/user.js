import asyncHandler from '../middleware/async'
import { updateScoreService, changePasswordService } from '../services/user'
import { makeResponse } from '../utils/response'

export const create = asyncHandler(async (req, res, next) => {})

export const getAll = asyncHandler(async (req, res, next) => {})

export const getById = asyncHandler(async (req, res, next) => {})

export const update = asyncHandler(async (req, res, next) => {})

export const remove = asyncHandler(async (req, res, next) => {})

export const updateScore = asyncHandler(async (req, res, next) => {
  await updateScoreService(req.body.user)
  makeResponse({ res, status: 200, message: 'User score updated' })
})

export const changePassword = asyncHandler(async (req, res, next) => {
  const result = await changePasswordService(req.user, req.body.old_password, req.body.new_password)
  if (!result) return makeResponse({ res, status: 500, message: 'Failed to change password' })
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({ res, message: 'Password changed successfully' })
})
