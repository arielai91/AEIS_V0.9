import AppError from './app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class TimeoutError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.REQUEST_TIMEOUT);
  }
}

export default TimeoutError;