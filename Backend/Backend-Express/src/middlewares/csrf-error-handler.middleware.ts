import { Request, Response, NextFunction } from 'express';

interface CsrfError extends Error {
    code?: string;
}

const csrfErrorHandler = (err: CsrfError, _req: Request, res: Response, next: NextFunction): void => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ message: 'CSRF token inválido o faltante' });
    } else {
        next(err);
    }
};

export default csrfErrorHandler;