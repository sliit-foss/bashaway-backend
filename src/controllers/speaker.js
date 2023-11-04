import * as speakerRepository from '@/repository/speaker';
import { makeResponse } from '@/utils/response';

export const getAllSpeakers = async (req, res) => {
  const data = await speakerRepository.findAll(req.query);
  return makeResponse({ res, data, message: 'Speakers retrieved successfully' });
};

export const createSpeaker = async (req, res) => {
  const speaker = await speakerRepository.insertOne(req.body);
  return makeResponse({ res, status: 201, data: speaker, message: 'Speaker added successfully' });
};

export const getSpeakerById = async (req, res) => {
  const result = await speakerRepository.findById(req.params.speaker_id);
  return makeResponse({ res, data: result, message: 'Speaker retrieved successfully' });
};

export const updateSpeaker = async (req, res) => {
  const speaker = await speakerRepository.updateById(req.params.speaker_id, req.body);
  return makeResponse({ res, data: speaker, message: 'Speaker updated successfully' });
};

export const deleteSpeaker = async (req, res) => {
  await speakerRepository.deleteById(req.params.speaker_id);
  return makeResponse({ res, message: 'Speaker deleted successfully' });
};
