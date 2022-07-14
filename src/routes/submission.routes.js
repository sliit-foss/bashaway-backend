import express from 'express'
import { create, view, grade } from '../controllers/submission'

const submissionRouter = express.Router()

submissionRouter.post('/create', create)
submissionRouter.post('/grade', grade)
submissionRouter.get('/view', view)

export default submissionRouter
