import asyncHandler from '../middleware/async'
import { updateScoreService } from '../services/user'
import { makeResponse } from '../utils/response'
import { getUsers } from '../services/user'
// import User from '../models/user'

export const create = asyncHandler(async (req, res, next) => {})

export const getAll = asyncHandler(async (req, res, next) => {
  const users = await getUsers()

  makeResponse({ res, status: 200, data: users, message: 'Users retrived succesfully' })
})

export const getById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    res.status(201).json({ user })
  } catch (error) {
    res.status(404).json(error)
  }
})

export const update = asyncHandler(async (req, res, next) => {})

export const remove = asyncHandler(async (req, res, next) => {})

export const updateScore = asyncHandler(async (req, res, next) => {
  await updateScoreService(req.body.user)
  makeResponse({ res, status: 200, message: 'User score updated' })
})
