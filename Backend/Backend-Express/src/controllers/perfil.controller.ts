import { Request, Response } from 'express';

class PerfilController {
  public getPerfil(_req: Request, res: Response): void {
    res.send('Perfil');
  }
}

export default new PerfilController();