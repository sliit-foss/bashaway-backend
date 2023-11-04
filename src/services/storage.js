import { AZURE } from '@/config';

export const signUrl = (url, upload) => {
  if (upload) {
    url += `?${AZURE.CHALLENGE_UPLOAD_SAS_TOKEN}`;
  } else {
    url += `?${AZURE.SOLUTION_DOWNLOAD_SAS_TOKEN}`;
  }
  return url;
};
