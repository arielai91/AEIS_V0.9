import AppError from './app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export default DatabaseError;