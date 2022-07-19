import asyncHandler from '../middleware/async'
import { updateScoreService } from '../services/user'
import { makeResponse } from '../utils/response'
import { getUsers, getUserByID } from '../services/user'

export const create = asyncHandler(async (req, res, next) => {})

export const getAll = asyncHandler(async (req, res, next) => {
  const users = await getUsers()

  makeResponse({ res, status: 200, data: users, message: 'Users retrieved succesfully' })
})

export const getById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const user = await getUserByID(id)
  makeResponse({ res, status: 200, data: user, message: 'User retrieved succesfully' })
})

export const update = asyncHandler(async (req, res, next) => {})

export const remove = asyncHandler(async (req, res, next) => {})

export const updateScore = asyncHandler(async (req, res, next) => {
  await updateScoreService(req.body.user)
  makeResponse({ res, status: 200, message: 'User score updated' })
})
