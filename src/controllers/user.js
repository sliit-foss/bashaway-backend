import asyncHandler from '../middleware/async'
import { updateScoreService } from '../services/user'
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
