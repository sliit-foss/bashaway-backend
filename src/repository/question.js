import Question from '../models/question'

export const insertQuestion = async (data) => {
    return await (new Question(data)).save()
}

export const findQuestion = async (filters) => {
    return await Question.findOne(filters)
}

export const getQuestionById = async (id, filterFields = true) => {
    let query = Question.findById(id)
    if (filterFields) query = query.select('-creator -creator_lock')
    return await query.exec()
}

export const getAllQuestionIds = async (filters) => {
  if (!filters) filters = {}

  const questions = await Question.find(filters).select('_id').lean()

  const ids = questions.map(question => question._id)
  return ids
}

export const deleteAQuestion = async (filters) => {
    return await Question.deleteOne(filters)
}