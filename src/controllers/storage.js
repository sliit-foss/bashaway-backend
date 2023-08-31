import { signUrl as sign } from '@/services/storage';
import { makeResponse } from '@/utils/response';

export const signUrl = (req, res) => {
  const signedUrl = sign(decodeURIComponent(req.query.url), req.query.upload === 'true');
  return makeResponse({
    res,
    data: { signed_url: signedUrl },
    message: 'Url signed successfully'
  });
};
