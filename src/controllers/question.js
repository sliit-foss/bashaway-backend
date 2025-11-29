import * as service from '@/services/question';
import { makeResponse } from '@/utils/response';

export const getAllQuestions = async (req, res) => {
  const data = await service.retrieveAllQuestions(req.user, req.query);
  return makeResponse({ res, data, message: 'Questions retrieved successfully' });
};

export const createNewQuestion = async (req, res) => {
  await service.createQuestion(req.body, req.user);
  return makeResponse({ res, message: 'Question added successfully' });
};

export const getQuestionById = async (req, res) => {
  const result = await service.retrieveQuestion(req.params.question_id, req.user);
  return makeResponse({ res, data: result, message: 'Question retrieved successfully' });
};

export const updateQuestion = async (req, res) => {
  await service.updateQuestionById(req.params.question_id, req.body, req.user);
  return makeResponse({ res, message: 'Question updated successfully' });
};

export const deleteOldQuestion = async (req, res) => {
  await service.deleteQuestion(req.params.question_id, req.user);
  return makeResponse({ res, message: 'Question deleted successfully' });
};

export const bulkUpdateQuestions = async (req, res) => {
  const result = await service.bulkUpdateQuestions(req.body);
  return makeResponse({
    res,
    message: `${result.modifiedCount} questions ${req.body.enabled ? 'enabled' : 'disabled'} successfully`
  });
};
