import asyncHandler from '../middleware/async'
import { updateScoreService } from '../services/user'
import { makeResponse } from '../utils/response'
import { updateUserdetails } from '../services/user'

export const create = asyncHandler(async (req, res, next) => { })

export const getAll = asyncHandler(async (req, res, next) => { })

export const getById = asyncHandler(async (req, res, next) => { })

export const update = asyncHandler(async (req, res, next) => {

  const result = await updateUserdetails(req.user, req.body)
  if (!result) return makeResponse({ res, status: 400, message: "Updating user failed" })
  if (result.status)
    return makeResponse({ res, ...result })
  return makeResponse({ res, status: 200, data: result, message: "User updated" })

})

export const remove = asyncHandler(async (req, res, next) => { })

export const updateScore = asyncHandler(async (req, res, next) => {
  if(await updateScoreService(req.params.id))
    makeResponse({ res, status: 200, message: 'User score updated' })
  else
    makeResponse({ res, status: 404, message: 'Invalid user ID' })
})
