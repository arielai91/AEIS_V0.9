import { Request, Response } from 'express';
import { Types } from 'mongoose'; // Importar Types de mongoose
import AuthService from '@services/auth.service';
import PerfilService from '@services/perfil.service';
import Logger from '@logger/logger'; // Importar Logger

class AuthController {
    // Controlador para manejar el inicio de sesión
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const token = await AuthService.login(email, password);
            res.json({ token });
        } catch (error) {
            if (error instanceof Error) {
                Logger.error('Error en login', error);
                res.status(401).json({ message: error.message });
            } else {
                Logger.error('Error desconocido en login');
                res.status(401).json({ message: 'Error desconocido' });
            }
        }
    }

    // Controlador para obtener el perfil del usuario autenticado
    public async getProfile(req: Request, res: Response): Promise<void> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token no proporcionado' });
            return;
        }

        try {
            const decoded = AuthService.verifyToken(token);
            // TODO: cambiar para obtener el perfil del usuario autenticado por cedula o correo
            const perfil = await PerfilService.getPerfilById(new Types.ObjectId(decoded.id));
            res.json(perfil);
        } catch (error) {
            if (error instanceof Error) {
                Logger.error('Error en getProfile', error);
            } else {
                Logger.error('Error desconocido en getProfile');
            }
            res.status(401).json({ message: 'Token inválido' });
        }
    }
}

export default new AuthController();