import { getSettingsDoc, updateSettingsDoc } from '@/repository/settings';
import { makeResponse } from '@/utils/response';

export const getSettings = async (_, res) => {
  const data = await getSettingsDoc();
  return makeResponse({
    res,
    data,
    message: 'Settings retrieved successfully'
  });
};

export const updateSettings = async (_, res) => {
  const data = await updateSettingsDoc();
  return makeResponse({
    res,
    data,
    message: 'Settings updated successfully'
  });
};
