import asyncHandler from '../middleware/async'
import { updateScoreService } from '../services/user'
import { makeResponse } from '../utils/response'
import { getUsers, getUserByID } from '../services/user'

export const create = asyncHandler(async (req, res) => {})

export const getAll = asyncHandler(async (req, res) => {
  const users = await getUsers(req.query)
  return makeResponse({ res, status: 200, data: users, message: 'Users retrieved succesfully' })
})

export const getById = asyncHandler(async (req, res) => {
  const user = await getUserByID(req.params.id)
  return makeResponse({ res, status: 200, data: user, message: 'User retrieved succesfully' })
})

export const update = asyncHandler(async (req, res) => {})

export const updateScore = asyncHandler(async (req, res) => {
  await updateScoreService(req.body.user)
  return makeResponse({ res, status: 200, message: 'User score updated' })
})
