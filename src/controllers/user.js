import asyncHandler from "../middleware/async"
import { makeResponse } from "../utils/response"
import { getupdate } from "../services/user"

export const create = asyncHandler(async (req, res, next) => {})

export const getAll = asyncHandler(async (req, res, next) => {})

export const getById = asyncHandler(async (req, res, next) => {})

export const update = asyncHandler(async(req, res, next) => {
    await getupdate(req.user , req.body)

    makeResponse({ res, status: 200, message: "User details updated" })
})

export const remove = asyncHandler(async (req, res, next) => {})