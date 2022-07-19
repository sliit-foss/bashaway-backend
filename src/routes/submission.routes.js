import express from 'express'
import { create, view, grade } from '../controllers/submission'
import { protect, adminProtect } from '../middleware/auth';

const submissionRouter = express.Router()

submissionRouter.post('/', protect, create)
submissionRouter.get('/', view)
submissionRouter.put('/:id', protect, adminProtect, grade)

export default submissionRouter
