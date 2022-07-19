import express from 'express'
import { createNewQuestion } from '../controllers/question'
import { protect, adminProtect } from '../middleware/auth';

const questionRouter = express.Router()

questionRouter.post('/', protect, adminProtect, createNewQuestion)

export default questionRouter