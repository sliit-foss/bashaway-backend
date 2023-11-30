export const signUrl = (url, upload) => {
  if (upload) {
    url += `?${process.env.AZURE_CHALLENGE_UPLOAD_SAS_TOKEN}`;
  } else {
    url += `?${process.env.AZURE_SOLUTION_DOWNLOAD_SAS_TOKEN}`;
  }
  return url;
};
