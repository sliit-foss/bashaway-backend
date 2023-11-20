import crypto from 'crypto';

export const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');
