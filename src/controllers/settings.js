import * as settingRepository from '@/repository/settings';
import { makeResponse } from '@/utils/response';

export const getSettings = async (_, res) => {
  const data = await settingRepository.getDoc();
  return makeResponse({
    res,
    data,
    message: 'Settings retrieved successfully'
  });
};

export const updateSettings = async (_, res) => {
  const data = await settingRepository.updateDoc();
  return makeResponse({
    res,
    data,
    message: 'Settings updated successfully'
  });
};
