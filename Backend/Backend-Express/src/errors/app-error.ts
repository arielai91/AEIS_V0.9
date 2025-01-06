import { HttpStatusCode } from '@utils/http-status-codes';

class AppError extends Error {
  public statusCode: HttpStatusCode;

  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;