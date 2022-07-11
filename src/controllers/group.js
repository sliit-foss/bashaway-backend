import asyncHandler from "../middleware/async"
import * as groupService from "../services/group"
import { makeResponse } from "../utils/response"

export const create = asyncHandler(async (req, res) => {
    const result = await groupService.create(req.body, {_id: "6295beb5e6a60dc802f5effc"});
    return makeResponse({res, message: "Group created successfully", ...result});
})

export const getAll = asyncHandler(async (req, res, next) => { })

export const getById = asyncHandler(async (req, res, next) => { })

export const update = asyncHandler(async (req, res, next) => { })

export const generateInvite = asyncHandler(async (req, res, next) => { })

export const joinGroup = asyncHandler(async (req, res, next) => { })

export const leaveGroup = asyncHandler(async (req, res, next) => { 
    const result = await groupService.leaveGroup(req.params.id, req.params.remove_user);
})

export const removeUser = asyncHandler(async (req, res, next) => { })