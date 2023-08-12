import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { getSettings, updateSettings } from '@/controllers/settings';
import { adminProtect } from '@/middleware';
import { updateSettingsSchema } from '@/validations/settings';

const settings = express.Router();

settings.get('/', tracedAsyncHandler(getSettings));

settings.patch(
  '/',
  celebrate({ [Segments.PARAMS]: updateSettingsSchema, [Segments.BODY]: updateSettingsSchema }),
  adminProtect,
  tracedAsyncHandler(updateSettings)
);

export default settings;
