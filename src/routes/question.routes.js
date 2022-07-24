import express from 'express'
import { createNewQuestion , getQuestionById , deleteOldQuestion } from '../controllers/question'
import { adminProtect } from '../middleware/auth';

const questionRouter = express.Router()

questionRouter.post('/', adminProtect, createNewQuestion)
questionRouter.get('/:question_id', getQuestionById )
questionRouter.delete('/:question_id', adminProtect, deleteOldQuestion)

export default questionRouter
