<<<<<<< Updated upstream
import { insertQuestion, checkQuestion } from '../repository/question'
=======
import { insertQuestion , getQuestion} from '../repository/question'
>>>>>>> Stashed changes

export const createQuestion = async ({name, description, difficulty, bash_only, max_score, enabled, creator_lock}, {_id}) => {
    await insertQuestion(name, description, difficulty, bash_only, max_score, enabled, _id, creator_lock)
}

export const isNameTaken = async ({name}) => {
    const exist = await checkQuestion(name)
    return exist
}


export const retrieveQuestion = async ({question_id}) => {
    return await getQuestion(question_id);
}
