import createError from 'http-errors';
import { attachSubmissionAttributesToQuestion } from '@/helpers';
import {
  bulkUpdateQuestions,
  deleteAQuestion,
  findAllQuestions,
  findAndUpdateQuestion,
  findQuestion,
  getQuestionById,
  insertQuestion
} from '@/repository/question';
import { getDistinctSubmissions, getOneSubmission } from '@/repository/submission';

export const retrieveAllQuestions = async (user, query) => {
  const questions = await findAllQuestions(user, query);
  await Promise.all(
    (query.page ? questions.docs : questions).map((question) => {
      return attachSubmissionAttributesToQuestion(question, user);
    })
  );
  return questions;
};

export const createQuestion = (data, user) => {
  return insertQuestion({ ...data, creator: user._id });
};

export const retrieveQuestion = async (question_id, user) => {
  const result = await getQuestionById(question_id, user);
  if (!result) throw new createError(404, "Question doesn't exist or you do not have permission to view this question");
  return attachSubmissionAttributesToQuestion(result, user);
};

export const updateQuestionById = async (question_id, data, user) => {
  const question = await findQuestion({ _id: question_id });
  if (!question) throw new createError(400, "Question doesn't exist to update");
  if (data.name) {
    const check = await findQuestion({ name: data.name });
    if (check && check._id?.toString() !== question_id?.toString())
      throw new createError(400, 'Question name already taken');
  }
  if (question.creator_lock && question.creator.toString() !== user._id.toString())
    throw new createError(403, 'You are not authorized to update this question');
  if (data.max_score && data.max_score !== question.max_score) {
    const submissionCount = (await getDistinctSubmissions(question_id)).length;
    if (submissionCount > 0) throw new createError(400, 'Cannot update a question with submissions');
  }
  return findAndUpdateQuestion({ _id: question_id }, data);
};

export const deleteQuestion = async (question_id, user) => {
  const question = await findQuestion({ _id: question_id });
  if (!question) throw new createError(400, "Question doesn't exist to remove");

  const checkSubmission = await getOneSubmission({ question: question_id });

  if (question.enabled) {
    throw new createError(400, 'Failed to delete question as it is activated');
  }
  if (checkSubmission) {
    throw new createError(400, 'Failed to delete question as it has a submission');
  }
  if (question.creator_lock && question.creator.toString() !== user._id.toString())
    throw new createError(403, 'You are not authorized to delete this question');
  return deleteAQuestion({ _id: question_id });
};

export const bulkUpdateQuestionStatus = (enabled) => {
  return bulkUpdateQuestions({}, { enabled });
};
