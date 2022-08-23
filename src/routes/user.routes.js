import express from 'express'
import { celebrate, Segments } from 'celebrate'
import { create, getAll, getById, update, updateScore, updateAllScores, changePassword } from '../controllers/user'
import { adminProtect } from '../middleware/auth'
import { addUserSchema, changePasswordSchema, userIdSchema, updateSchema } from '../validations/user'

const userRouter = express.Router()

userRouter.post('/', adminProtect, celebrate({ [Segments.BODY]: addUserSchema }), create)
userRouter.get('/', adminProtect, getAll)
userRouter.get('/:id', celebrate({ [Segments.PARAMS]: userIdSchema }), adminProtect, getById)
userRouter.put('/score', adminProtect, updateAllScores)
userRouter.put('/change_password', celebrate({ [Segments.BODY]: changePasswordSchema }), changePassword)
userRouter.put('/:id', celebrate({ [Segments.PARAMS]: userIdSchema, [Segments.BODY]: updateSchema }), update)
userRouter.put('/:id/score', adminProtect, celebrate({ [Segments.PARAMS]: userIdSchema }), updateScore)

export default userRouter
