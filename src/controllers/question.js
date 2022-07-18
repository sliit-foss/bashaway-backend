import asyncHandler from '../middleware/async'
import Question from '../models/question';

export const createQuestion = asyncHandler(async (req, res) => {
    const data = req.body;
    const questions = await Question.create(data);
    res.json(questions);
})
