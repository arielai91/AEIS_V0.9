import AppError from './app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class ConfigError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export default ConfigError;