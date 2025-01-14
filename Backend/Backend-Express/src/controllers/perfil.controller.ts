import { Request, Response, NextFunction } from 'express';
import PerfilService from '@services/perfil.service';
import { CreatePerfilDto, UpdatePerfilDto } from '@dtos/perfil.dto';

class PerfilController {
  public async createPerfil(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreatePerfilDto = req.body;
      const perfil = await PerfilService.createPerfil(data);
      res.status(201).json(perfil);
    } catch (error) {
      next(error);
    }
  }

  public async getPerfilById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const perfil = await PerfilService.getPerfilById(id);

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil not found' });
    }

    return res.json(perfil);
  }

  public async updatePerfil(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: UpdatePerfilDto = req.body;
    const perfil = await PerfilService.updatePerfil(id, data);

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil not found' });
    }

    return res.json(perfil);
  }

  public async deletePerfil(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const perfil = await PerfilService.deletePerfil(id);

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil not found' });
    }

    return res.status(204).send();
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  }

  public async prueba(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: 'Prueba' });
  }
}

export default new PerfilController();