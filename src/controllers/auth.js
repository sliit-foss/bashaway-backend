import asyncHandler from "../middleware/async"
import {authRegister} from "../services/auth"
import {makeResponse} from "../utils/response"
import {sendTokenResponse} from "../utils/jwt";
import logger from "../utils/logger";

export const register = asyncHandler(async(req, res, next) => {
    try {
        const {name, email, password, photo_url} = req.body;
        
        const user = await authRegister(name, email, password, photo_url);
        if (user) return makeResponse({res, message:"User created successfully"});
        return makeResponse({res, status: 500, message:"Failed to register user"});
    }
    catch (e) {
        logger.error(e);
        return makeResponse({res, status:500,  message:e.message});
    }
});

export const login = asyncHandler(async(req, res, next) => {})

export const logout = asyncHandler(async(req, res, next) => {})

export const current = asyncHandler(async(req, res, next) => {})