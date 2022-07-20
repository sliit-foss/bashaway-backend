import { insertQuestion, findQuestion, getQuestionById } from '../repository/question'

export const createQuestion = async (data, user) => {
    const question = await findQuestion({ name: data.name })
    if (question) return { status: 400, message: 'Question name already taken' }
    return await insertQuestion({ ...data, creator: user._id })
}

export const retrieveQuestion = async (question_id) => {
    return await getQuestionById(question_id);
}
