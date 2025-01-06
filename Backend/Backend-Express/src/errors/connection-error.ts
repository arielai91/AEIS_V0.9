import AppError from '@errors/app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class ConnectionError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export default ConnectionError;