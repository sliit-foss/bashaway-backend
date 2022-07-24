import { findAllQuestions, insertQuestion, findQuestion, findAndUpdateQuestion, getQuestionById, deleteAQuestion } from '../repository/question'

export const retrieveAllQuestions = async (user) => {
    return findAllQuestions(user._id)
}

export const createQuestion = async (data, user) => {
    const question = await findQuestion({ name: data.name })
    if (question) return { status: 400, message: 'Question name already taken' }
    return await insertQuestion({ ...data, creator: user._id })
}

export const retrieveQuestion = async (question_id, user) => {
  const result = await getQuestionById(question_id, user._id);
  if (result.length === 0) return { status: 400, message: 'Question doesn\'t exist or you do not have permission to view this question' }
  return result
}

export const updateQuestionById = async (question_id, data, user) => {
    let question = await findQuestion({ _id: question_id })
    if (!question) return { status: 400, message: 'Question doesn\'t exist to update' }
    if (data.name) {
        const check = await findQuestion({ name: data.name })
        if (check) return { status: 400, message: 'Question name already taken' }
    }
    if (question.creator_lock && question.creator.toString() !== user._id.toString()) return { status: 403, message: 'You are not authorized to update this question' }
    return await findAndUpdateQuestion({ _id: question_id }, data)
}

export const deleteQuestion = async (question_id, user) => {
    const question = await findQuestion({ _id: question_id })
    if (!question) return { status: 400, message: 'Question doesn\'t exist to remove' }
    if (question.creator_lock && question.creator.toString() !== user._id.toString()) return { status: 403, message: 'You are not authorized to delete this question' }
    return await deleteAQuestion({ _id: question_id })
}
