import winston from 'winston';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'blue',
  }
};

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    })
  ]
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: winston.format.json()
    })
  ]
});

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger;
