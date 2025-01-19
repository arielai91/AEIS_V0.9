// s3.controller.ts
import { Request, Response } from 'express';
import s3Service from '@services/s3.service';
import PerfilModel from '@models/Perfil/Perfil';
import logger from '@logger/logger';

// Extender la interfaz Request para incluir la propiedad user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

class S3Controller {
  async serveStaticImage(req: Request, res: Response): Promise<void> {
    try {
      const { fileName } = req.params;
      const url = await s3Service.getSignedUrl('static', fileName);
      res.redirect(url);
    } catch (err) {
      logger.error('Error al servir imagen estática', err as Error);
      res.status(404).json({ success: false, message: 'Imagen estática no encontrada.' });
    }
  }

  async servePerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: 'No autorizado.' });
        return;
      }

      const perfil = await PerfilModel.findById(userId);

      if (!perfil || !perfil.imagen) {
        res.status(404).json({ success: false, message: 'Imagen de perfil no encontrada.' });
        return;
      }

      const url = await s3Service.getSignedUrl('perfil', perfil.imagen);
      res.redirect(url);
    } catch (err) {
      logger.error('Error al servir imagen de perfil', err as Error);
      res.status(500).json({ success: false, message: 'Error al obtener la imagen de perfil.' });
    }
  }

  async uploadPerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: 'No autorizado.' });
        return;
      }

      const file = req.file;

      if (!file) {
        res.status(400).json({ success: false, message: 'Archivo no proporcionado.' });
        return;
      }

      const folder = 'perfil';
      const fileName = `${userId}-${Date.now()}-${file.originalname}`;

      await s3Service.uploadFile(folder, fileName, file.buffer, file.mimetype);
      await PerfilModel.findByIdAndUpdate(userId, { imagen: fileName });

      res.status(200).json({ success: true, message: 'Imagen subida con éxito.', fileName });
    } catch (err) {
      logger.error('Error al subir la imagen de perfil', err as Error);
      res.status(500).json({ success: false, message: 'Error al subir la imagen de perfil.' });
    }
  }

  async updatePerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: 'No autorizado.' });
        return;
      }

      const file = req.file;

      if (!file) {
        res.status(400).json({ success: false, message: 'Archivo no proporcionado.' });
        return;
      }

      const perfil = await PerfilModel.findById(userId);

      if (!perfil || !perfil.imagen) {
        res.status(404).json({ success: false, message: 'Perfil no encontrado o sin imagen previa.' });
        return;
      }

      await s3Service.deleteFile('perfil', perfil.imagen);

      const fileName = `${userId}-${Date.now()}-${file.originalname}`;
      await s3Service.uploadFile('perfil', fileName, file.buffer, file.mimetype);

      await PerfilModel.findByIdAndUpdate(userId, { imagen: fileName });

      res.status(200).json({ success: true, message: 'Imagen de perfil actualizada con éxito.', fileName });
    } catch (err) {
      logger.error('Error al actualizar la imagen de perfil', err as Error);
      res.status(500).json({ success: false, message: 'Error al actualizar la imagen de perfil.' });
    }
  }

  async deletePerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: 'No autorizado.' });
        return;
      }

      const perfil = await PerfilModel.findById(userId);

      if (!perfil || !perfil.imagen) {
        res.status(404).json({ success: false, message: 'Imagen de perfil no encontrada.' });
        return;
      }

      await s3Service.deleteFile('perfil', perfil.imagen);
      await PerfilModel.findByIdAndUpdate(userId, { imagen: null });

      res.status(200).json({ success: true, message: 'Imagen eliminada con éxito.' });
    } catch (err) {
      logger.error('Error al eliminar la imagen de perfil', err as Error);
      res.status(500).json({ success: false, message: 'Error al eliminar la imagen de perfil.' });
    }
  }
}

export default new S3Controller();