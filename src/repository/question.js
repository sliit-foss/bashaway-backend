import Question from '../models/question'
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const findAllQuestions = async (user) => {
    return Question.find({
        $or: [
            { creator_lock: false },
            { creator_lock: true, creator: user._id },
        ]
    }).select('-creator -creator_lock')
}

export const insertQuestion = async (data) => {
    return await (new Question(data)).save()
}

export const findQuestion = async (filters) => {
    return await Question.findOne(filters)
}

export const getQuestionById = async (id, user, filterFields = true) => {
    let query = Question.find({
        $and: [
            { _id: { $eq: new ObjectId(id)  } },
            {
                $or: [
                    { creator_lock: false },
                    { creator_lock: true, creator: user._id },
                ]
            }
        ]
    })
    if (filterFields) query = query.select('-creator -creator_lock')
    return await query.exec()
}

export const getAllQuestionIds = async (filters = {}) => {
    const questions = await Question.find(filters).select('_id').lean()
    return questions.map(question => question._id)
}

export const findAndUpdateQuestion = async (filters, data) => {
    return await Question.findOneAndUpdate(filters, data, { new: true })
}

export const deleteAQuestion = async (filters) => {
    return await Question.deleteOne(filters)
}