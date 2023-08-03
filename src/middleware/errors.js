import { moduleLogger } from '@sliit-foss/module-logger';
import { isCelebrateError } from 'celebrate';
import { responseInterceptor } from './response';
import { makeResponse } from '@/utils';

const logger = moduleLogger('Error-handler');

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _) => {
  if (!res.errorLogged) {
    logger.error(`Error: ${err.message} | Request Path - ${req.path} | Stack: ${err.stack}`, {
      payload: req.body,
      headers: req.headers
    });
    res.errorLogged = true;
  }

  responseInterceptor({}, res);

  if (isCelebrateError(err)) {
    for (const [, value] of err.details.entries()) {
      return makeResponse({ res, status: 422, message: value.details[0].message });
    }
  } else if (err.name == 'MongoServerError' && err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    return makeResponse({ res, status: 400, message: `The ${key} ${err.keyValue[key]} is already taken` });
  } else if (err.message === 'jwt expired') {
    return makeResponse({ res, status: 401, message: 'Token expired' });
  } else if (['invalid token', 'jwt malformed'].includes(err.message)) {
    return makeResponse({ res, status: 401, message: 'Invalid token' });
  }
  return makeResponse({
    res,
    status: err.status ?? 500,
    message: err.message && err.expose ? err.message : "Just patching things up. This'll be over in a jiffy!"
  });
};
