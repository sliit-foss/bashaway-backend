import asyncHandler from '../middleware/async';
import {
  createQuestion,
  deleteQuestion,
  retrieveAllQuestions,
  retrieveQuestion,
  updateQuestionById
} from '../services/question';
import { makeResponse } from '../utils/response';

export const getAllQuestions = asyncHandler(async (req, res) => {
  const data = await retrieveAllQuestions(req.user, req.query);
  return makeResponse({ res, data, message: 'Questions retrieved successfully' });
});

export const createNewQuestion = asyncHandler(async (req, res) => {
  const result = await createQuestion(req.body, req.user);
  if (!result) return makeResponse({ res, status: 500, message: 'Failed to add question' });
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, message: 'Question added successfully' });
});

export const getQuestionById = asyncHandler(async (req, res) => {
  const result = await retrieveQuestion(req.params.question_id, req.user);
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, data: result, message: 'Question retrieved successfully' });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const result = await updateQuestionById(req.params.question_id, req.body, req.user);
  if (!result) return makeResponse({ res, status: 500, message: 'Failed to update question' });
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, message: 'Question updated successfully' });
});

export const deleteOldQuestion = asyncHandler(async (req, res) => {
  const result = await deleteQuestion(req.params.question_id, req.user);
  if (!result) return makeResponse({ res, status: 500, message: 'Failed to delete question' });
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, message: 'Question deleted successfully' });
});
