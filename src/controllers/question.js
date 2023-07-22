import {
  createQuestion,
  deleteQuestion,
  retrieveAllQuestions,
  retrieveQuestion,
  updateQuestionById
} from '@/services/question';
import { makeResponse } from '@/utils/response';

export const getAllQuestions = async (req, res) => {
  const data = await retrieveAllQuestions(req.user, req.query);
  return makeResponse({ res, data, message: 'Questions retrieved successfully' });
};

export const createNewQuestion = async (req, res) => {
  await createQuestion(req.body, req.user);
  return makeResponse({ res, message: 'Question added successfully' });
};

export const getQuestionById = async (req, res) => {
  const result = await retrieveQuestion(req.params.question_id, req.user);
  return makeResponse({ res, data: result, message: 'Question retrieved successfully' });
};

export const updateQuestion = async (req, res) => {
  await updateQuestionById(req.params.question_id, req.body, req.user);
  return makeResponse({ res, message: 'Question updated successfully' });
};

export const deleteOldQuestion = async (req, res) => {
  await deleteQuestion(req.params.question_id, req.user);
  return makeResponse({ res, message: 'Question deleted successfully' });
};
