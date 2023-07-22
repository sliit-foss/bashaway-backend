import winston from 'winston';

const stacktrace = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message
    });
  }
  return info;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    stacktrace(),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `logs/error/${new Date().toISOString().slice(0, 10)}.log`,
      level: 'error'
    }),
    new winston.transports.File({
      filename: `logs/info/${new Date().toISOString().slice(0, 10)}.log`,
      level: 'info'
    })
  ]
});

export default logger;
