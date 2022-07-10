import jwt from "jsonwebtoken";

const sendTokenResponse = (res, user) => {
    const token = generateToken(user)

    const options = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV=== "production") {
        options.secure = true
    }

    res.status(200).cookie("token", token, options).json({success: true, token})
}

const generateToken = (user) => {
    return jwt.sign({data: user}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

const decodeJwtToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    sendTokenResponse,
    generateToken,
    decodeJwtToken,
}