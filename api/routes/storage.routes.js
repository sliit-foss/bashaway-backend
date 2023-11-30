import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { signUrl } from '@/controllers/storage';
import { signUrlSchema } from '@/validations/storage';

const storage = express.Router();

storage.get('/sign', celebrate({ [Segments.QUERY]: signUrlSchema }), tracedAsyncHandler(signUrl));

export default storage;
