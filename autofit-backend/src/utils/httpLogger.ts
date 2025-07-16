import { createLogger, format, transports } from 'winston';
import path from 'path';

const httpLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({
      filename: path.join('logs', 'http.log'),
    }),
  ],
});

export default httpLogger;
