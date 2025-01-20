import { createLogger, format, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';

class Logger {
  private logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public error(message: string, error?: Error): void {
    this.logger.error(`${message} - ${error?.message}`);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  // Middleware para registrar solicitudes HTTP
  public requestLogger(req: Request, res: Response, next: NextFunction): void {
    const { method, url } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const elapsedTime = Date.now() - startTime;
      this.info(`${method} ${url} ${statusCode} - ${elapsedTime}ms`);
    });

    next();
  }
}

export default new Logger();