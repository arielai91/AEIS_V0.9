import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import PerfilModel, { IPerfil } from '@models/Perfil/Perfil'; // Asegúrate de importar la interfaz correcta

class AuthService {
    // Método para loguear al usuario
    public async login(email: string, password: string): Promise<string | null> {
        const perfil = await PerfilModel.findOne({ email }).select('+contraseña') as IPerfil | null;
        if (!perfil) {
            throw new Error('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(password, perfil.contraseña);
        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }

        const token = this.generateToken(perfil._id.toString());
        return token;
    }

    // Método para generar un token JWT
    private generateToken(userId: string): string {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
    }

    // Método para verificar un token JWT
    public verifyToken(token: string): { id: string } {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        return jwt.verify(token, secret) as { id: string }; // Especifica el tipo de retorno
    }
}

export default new AuthService();