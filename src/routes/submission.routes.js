import express from 'express'
import { celebrate, Segments } from 'celebrate'

import { create, view, grade } from '../controllers/submission'
import { adminProtect } from '../middleware/auth'
import { submissionIdSchema } from '../validations/submission'

const submissionRouter = express.Router()

submissionRouter.post('/', create)
submissionRouter.get('/', view)
submissionRouter.put('/:id', celebrate({ [Segments.PARAMS]: submissionIdSchema }), adminProtect, grade)

export default submissionRouter
