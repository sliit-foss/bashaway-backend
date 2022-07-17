import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { findOneAndUpdateUser } from '../repository/user'

export const sendTokenResponse = async (res, user, message) => {
  const accessToken = generateToken(user)
  const refreshToken = generateToken(uuidv4())

  await findOneAndUpdateUser({ _id: user._id }, { refresh_token: refreshToken })

  const options = {
    expires: new Date(Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(200)
    .cookie('token', accessToken, options)
    .json({
      data: { user, access_token: accessToken, refresh_token: refreshToken },
      message,
    })
}

export const generateToken = (user) => {
  return jwt.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE}d`,
  })
}

export const decodeJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
