import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions/dist/async';
import { Segments, celebrate } from 'celebrate';
import { adminProtect } from '@/middleware';
import { getSettings, updateSettings } from '@/repository/settings';
import { updateSettingsSchema } from '@/validations/settings';

const settingsRouter = express.Router();

settingsRouter.get('/', tracedAsyncHandler(getSettings));

settingsRouter.post(
  '/',
  celebrate({ [Segments.BODY]: updateSettingsSchema }),
  adminProtect,
  tracedAsyncHandler(updateSettings)
);

settingsRouter.put(
  '/',
  celebrate({ [Segments.PARAMS]: updateSettingsSchema, [Segments.BODY]: updateSettingsSchema }),
  adminProtect,
  tracedAsyncHandler(updateSettings)
);

export default settingsRouter;
