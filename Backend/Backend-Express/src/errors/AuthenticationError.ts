import AppError from './app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}

export default AuthenticationError;