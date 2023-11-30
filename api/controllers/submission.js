import createError from 'http-errors';
import { getSubmissionDeadline } from '@/repository/settings';
import { createSubmission, gradeSubmission, viewSubmissions } from '@/services/submission';
import { makeResponse } from '@/utils/response';

export const create = async (req, res) => {
  if (new Date() >= new Date(await getSubmissionDeadline()))
    throw new createError(400, 'Submission period has expired');
  await createSubmission(req.body, req.user);
  return makeResponse({ res, status: 201, message: 'Submission added successfully' });
};

export const view = async (req, res) => {
  const data = await viewSubmissions(req.query, req.user);
  return makeResponse({ res, data, message: 'Submissions retrieved successfully' });
};

export const grade = async (req, res) => {
  await gradeSubmission(req.params.id, req.body, req.user);
  return makeResponse({ res, message: 'Submission graded successfully' });
};
