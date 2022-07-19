import { insertQuestion } from '../repository/question'

export const createQuestion = async ({name, description, difficulty, bash_only, max_score, enabled, creator_lock}, {_id}) => {
    await insertQuestion(name, description, difficulty, bash_only, max_score, enabled, _id, creator_lock);
}
