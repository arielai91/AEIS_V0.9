import AppError from '@errors/app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class HttpError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}

export default HttpError;