import asyncHandler from '../middleware/async'
<<<<<<< Updated upstream
import { createQuestion, isNameTaken } from '../services/question'
=======
import { createQuestion , retrieveQuestion} from '../services/question'
>>>>>>> Stashed changes
import { makeResponse } from '../utils/response'

export const createNewQuestion = asyncHandler(async (req, res) => {
    const exist = await isNameTaken(req.body)
    if(!exist){
        await createQuestion(req.body, req.user)
        makeResponse({ res, status: 200, message: 'Question added successfully'})
    }else{
        makeResponse({ res, status: 400, message: 'Question name already taken'})
    }
})

export const getQuestionById = asyncHandler(async (req, res) => {
    const data = await retrieveQuestion(req.params)
    makeResponse({ res, status: 200, data, message: 'Question retrieved successfully'})
})



