import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { ROLE } from '@/constants';
import { getSettings, updateSettings } from '@/controllers/settings';
import { roleProtect } from '@/middleware';
import { updateSettingsSchema } from '@/validations/settings';

const settings = express.Router();

settings.get('/', tracedAsyncHandler(getSettings));

settings.patch(
  '/',
  celebrate({ [Segments.BODY]: updateSettingsSchema }),
  roleProtect([ROLE.ADMIN]),
  tracedAsyncHandler(updateSettings)
);

export default settings;
