import AppError from './app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class RateLimitExceededError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.TOO_MANY_REQUESTS);
  }
}

export default RateLimitExceededError;
