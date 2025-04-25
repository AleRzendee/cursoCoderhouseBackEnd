import logger from '../config/logger.js';

export const attachLogger = (req, res, next) => {
  req.logger = logger;
  logger.http(`${req.method} ${req.url}`);
  next();
};
