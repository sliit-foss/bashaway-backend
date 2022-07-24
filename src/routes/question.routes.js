import express from 'express'
import { celebrate, Segments } from "celebrate"
import { createNewQuestion , getQuestionById , deleteOldQuestion } from '../controllers/question'
import { addQuestionSchema, questionIdSchema } from "../validations/question"
import { adminProtect } from '../middleware/auth';

const questionRouter = express.Router()

questionRouter.post('/', celebrate({ [Segments.BODY]: addQuestionSchema }), adminProtect, createNewQuestion)
questionRouter.get('/:question_id', celebrate({ [Segments.PARAMS]: questionIdSchema }), getQuestionById )
questionRouter.delete('/:question_id', adminProtect, deleteOldQuestion)

export default questionRouter
