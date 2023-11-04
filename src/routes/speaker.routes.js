import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { createSpeaker, deleteSpeaker, getAllSpeakers, getSpeakerById, updateSpeaker } from '@/controllers/speaker';
import { addSpeakerSchema, speakerIdSchema, updateSpeakerSchema } from '@/validations/speaker';

const speakers = express.Router();

speakers.get('/', tracedAsyncHandler(getAllSpeakers));
speakers.post('/', celebrate({ [Segments.BODY]: addSpeakerSchema }), tracedAsyncHandler(createSpeaker));
speakers.get('/:speaker_id', celebrate({ [Segments.PARAMS]: speakerIdSchema }), tracedAsyncHandler(getSpeakerById));
speakers.patch(
  '/:speaker_id',
  celebrate({ [Segments.PARAMS]: speakerIdSchema, [Segments.BODY]: updateSpeakerSchema }),
  tracedAsyncHandler(updateSpeaker)
);
speakers.delete('/:speaker_id', celebrate({ [Segments.PARAMS]: speakerIdSchema }), tracedAsyncHandler(deleteSpeaker));

export default speakers;
