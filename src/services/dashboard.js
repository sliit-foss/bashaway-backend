import {getAllQuestions} from "../repository/question";
import {getSubmissionsByQuestion} from "../repository/submission";

export const getAllQuestionsSubmissions = async () => {
    let questionData =  await getAllQuestions();
    questionData.docs = await Promise.all(
        questionData.docs.map(async (question) => {
            const submissions =  await getSubmissionsByQuestion(question._id);
            return {question, submissions: submissions.length};
        })
    );
        return questionData;
}