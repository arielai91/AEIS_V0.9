import AppError from './app-error';
import { HttpStatusCode } from '@utils/http-status-codes';

class CsrfError extends AppError {
    public code?: string;

    constructor(message: string, code?: string) {
        super(message, HttpStatusCode.FORBIDDEN);
        this.code = code;
    }
}

export default CsrfError;