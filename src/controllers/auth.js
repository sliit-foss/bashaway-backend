import asyncHandler from "../middleware/async"
import { authRegister, authLogin, updateVerificationStatus } from "../services/auth"
import { makeResponse } from "../utils/response"
import { sendTokenResponse } from "../utils/jwt";

export const register = asyncHandler(async (req, res) => {
    const result = await authRegister(req.body);
    if (!result) return makeResponse({ res, status: 500, message: "Failed to register user" });
    if (result.status) return makeResponse({ res, ...result });
    return makeResponse({ res, message: "User created successfully" });
});

export const login = asyncHandler(async (req, res) => {
    const user = await authLogin(req.body);
    if (!user) return makeResponse({ res, status: 401, message: "Invalid email or password" })
    if (!user.is_verified) return makeResponse({ res, status: 401, message: "Account not verified. Please check your email" });
    if (!user.is_active) return makeResponse({ res, status: 401, message: "Your account has been deactivated. Please contact a bashaway administrator to resolve it" });
    return sendTokenResponse(res, user, "User logged in successfully")
});

export const verifyUser = asyncHandler(async (req, res) => {
    const user = await updateVerificationStatus(req.params.verification_code);
    if (user) return makeResponse({ res, data: user, message: "User verified successfully" });
    return makeResponse({ res, status: 400, message: "Invalid verification code" });
})

export const logout = asyncHandler(async (req, res, next) => { })

export const current = asyncHandler(async (req, res, next) => { })
