import Question from '../models/question'

export const insertQuestion = async (setName, setDescription, setDifficulty, setBash_only, setMax_score, setEnabled, setCreator, setCreator_lock) => {
    const data = {
        "name": setName,
        "description": setDescription,
        "difficulty": setDifficulty,
        "bash_only": setBash_only,
        "max_score": setMax_score,
        "enabled": setEnabled,
        "creator": setCreator,
        "creator_lock": setCreator_lock
    };
    const newCreation = new Question(data)
    await newCreation.save()
}

<<<<<<< Updated upstream
export const checkQuestion = async (name) => {
    const questionCount = await Question.find({"name": name}).count();
    if(questionCount === 1){
        return true
    }
    return false
}
=======

export const getQuestion = async (id) => {
    const question = await Question.findById(id)
    return question
  }

>>>>>>> Stashed changes
