import * as submissionService from '@/services/submission';
import { makeResponse } from '@/utils/response';

export const createSubmission = async (req, res) => {
  await submissionService.create(req.body, req.user);
  return makeResponse({ res, status: 201, message: 'Submission added successfully' });
};

export const getAllSubmissions = async (req, res) => {
  const data = await submissionService.retrieveAll(req.query, req.user);
  return makeResponse({ res, data, message: 'Submissions retrieved successfully' });
};

export const gradeSubmission = async (req, res) => {
  await submissionService.grade(req.params.id, req.body, req.user);
  return makeResponse({ res, message: 'Submission graded successfully' });
};
