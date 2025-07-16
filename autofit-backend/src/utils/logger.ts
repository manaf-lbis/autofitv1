import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'autofit-backend' },
  transports: [
    new transports.File({ filename: errorLogPath, level: 'error' }),
    new transports.File({ filename: combinedLogPath }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(format.colorize(), format.simple())
  }));
}

export default logger;




// Level	Priority	Purpose

// error	🟥 0	Critical issues (app crash, DB failure, uncaught exceptions)
// warn	    🟧 1	Suspicious things (e.g., invalid input, deprecated API usage)
// info	    🟩 2	Normal app behavior (user login, server start, DB connected)
// http	    🟦 3	Request logs (used if manually configured or via Morgan)
// verbose	🟨 4	Extra internal details (used during deep debugging)
// debug	🟪 5	Low-level info useful for debugging (e.g., variable values)
// silly	🟫 6	Insanely detailed logs (usually never used in prod)