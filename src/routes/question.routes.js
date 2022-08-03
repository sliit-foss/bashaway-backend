import express from 'express'
import { celebrate, Segments } from "celebrate"
import { getAllQuestions, createNewQuestion , getQuestionById , updateQuestion, deleteOldQuestion } from '../controllers/question'
import { addQuestionSchema, updateQuestionSchema, questionIdSchema } from "../validations/question"
import { adminProtect } from '../middleware/auth';

const questionRouter = express.Router()

questionRouter.get('/', getAllQuestions )
questionRouter.post('/', celebrate({ [Segments.BODY]: addQuestionSchema }), adminProtect, createNewQuestion)
questionRouter.get('/:question_id', celebrate({ [Segments.PARAMS]: questionIdSchema }), getQuestionById )
questionRouter.put('/:question_id', celebrate({ [Segments.PARAMS]: questionIdSchema, [Segments.BODY]: updateQuestionSchema }), adminProtect, updateQuestion )
questionRouter.delete('/:question_id', celebrate({ [Segments.PARAMS]: questionIdSchema }), adminProtect, deleteOldQuestion )

export default questionRouter
