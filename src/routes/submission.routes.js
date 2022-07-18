import express from 'express'
import { create, view, grade } from '../controllers/submission'
import { adminProtect } from '../middleware/auth';

const submissionRouter = express.Router()

submissionRouter.post('/', create)
submissionRouter.get('/', view)
submissionRouter.put('/:id', adminProtect, grade)

export default submissionRouter
