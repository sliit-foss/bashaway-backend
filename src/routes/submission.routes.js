import express from 'express'
import { create, viewAll } from '../controllers/submission'

const submissionRouter = express.Router()

submissionRouter.post('/create', create)
submissionRouter.get('/viewAll', viewAll)

export default submissionRouter
