import express from 'express'
import { createNewQuestion , getQuestionById } from '../controllers/question'
import { adminProtect } from '../middleware/auth';

const questionRouter = express.Router()

questionRouter.post('/', adminProtect, createNewQuestion)
questionRouter.get('/:question_id', getQuestionById )

export default questionRouter