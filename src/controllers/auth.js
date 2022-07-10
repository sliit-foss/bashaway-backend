import asyncHandler from "../middleware/async"
import {authRegister, authLogin} from "../services/auth"
import {makeResponse} from "../utils/response"
import {sendTokenResponse} from "../utils/jwt";

export const register = asyncHandler(async(req, res, next) => {
        const {name, email, password, university} = req.body;
        const user = await authRegister(name, email, password, university);
        if (user) return makeResponse({res, message:"User created successfully"});
        return makeResponse({res, status: 500, message:"Failed to register user"});
    }
);

export const login = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body;
    const user = await authLogin(email, password);
    if (!user.is_verified) return makeResponse({res, status: 401, message:"User not verified"});
    if (!user.is_active) return makeResponse({res, status: 401, message:"User not active"});
    if (user) return sendTokenResponse(res, user, "User logged in successfully");
    return makeResponse({res, status: 401, message:"Invalid email or password"});   
});

export const logout = asyncHandler(async(req, res, next) => {})

export const current = asyncHandler(async(req, res, next) => {})
