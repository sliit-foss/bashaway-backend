import express from 'express'
import { createQuestion } from '../controllers/question'

const questionRouter = express.Router()

questionRouter.post('/', createQuestion)

export default questionRouter