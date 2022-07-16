import express from 'express'
import { create, view, grade } from '../controllers/submission'

const submissionRouter = express.Router()

submissionRouter.post('/', create)
submissionRouter.get('/', view)
submissionRouter.put('/:id', grade)

export default submissionRouter
