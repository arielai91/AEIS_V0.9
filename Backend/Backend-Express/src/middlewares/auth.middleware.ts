import { Request, Response, NextFunction } from 'express';
import AuthService from '@services/auth.service';

// Extender la interfaz Request para incluir la propiedad user
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }

    try {
        const decoded = AuthService.verifyToken(token);
        req.user = decoded; // Agrega el usuario decodificado a la solicitud
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido' });
    }
};

export default authMiddleware;