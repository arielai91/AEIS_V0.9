import { Request, Response } from 'express';
import s3Service from '@services/s3.service';
import PerfilModel from '@models/Perfil/Perfil';
import logger from '@logger/logger';
import { AuthenticatedRequest } from '@type/global';
import SolicitudModel from '@models/Solicitud/Solicitud';
import { UploadImageDto } from '@dtos/s3.dtos';
import { validate } from 'class-validator';

class S3Controller {
  /**
   * Servir imágenes estáticas
   */
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

  /**
   * Servir imagen de perfil
   */
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

  /**
   * Subir imagen de perfil
   */
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

      // Validar el tipo de contenido
      const uploadImageDto = new UploadImageDto();
      uploadImageDto.contentType = file.mimetype;
      const errors = await validate(uploadImageDto);
      if (errors.length > 0) {
        res.status(400).json({ success: false, errors });
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

  /**
   * Actualizar imagen de perfil
   */
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

      // Validar el tipo de contenido
      const uploadImageDto = new UploadImageDto();
      uploadImageDto.contentType = file.mimetype;
      const errors = await validate(uploadImageDto);
      if (errors.length > 0) {
        res.status(400).json({ success: false, errors });
        return;
      }

      const perfil = await PerfilModel.findById(userId);

      if (!perfil || !perfil.imagen) {
        res.status(404).json({ success: false, message: 'Perfil no encontrado o sin imagen previa.' });
        return;
      }

      if (perfil.imagen !== 'Foto_Defecto.png') {
        await s3Service.deleteFile('perfil', perfil.imagen);
      }

      const fileName = `${userId}-${Date.now()}-${file.originalname}`;
      await s3Service.uploadFile('perfil', fileName, file.buffer, file.mimetype);

      await PerfilModel.findByIdAndUpdate(userId, { imagen: fileName });

      res.status(200).json({ success: true, message: 'Imagen de perfil actualizada con éxito.', fileName });
    } catch (err) {
      logger.error('Error al actualizar la imagen de perfil', err as Error);
      res.status(500).json({ success: false, message: 'Error al actualizar la imagen de perfil.' });
    }
  }

  /**
   * Eliminar imagen de perfil
   */
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

      if (perfil.imagen !== 'Foto_Defecto.png') {
        await s3Service.deleteFile('perfil', perfil.imagen);
      }

      await PerfilModel.findByIdAndUpdate(userId, { imagen: 'Foto_Defecto.png' });

      res.status(200).json({ success: true, message: 'Imagen eliminada con éxito y se ha establecido la imagen por defecto.' });
    } catch (err) {
      logger.error('Error al eliminar la imagen de perfil', err as Error);
      res.status(500).json({ success: false, message: 'Error al eliminar la imagen de perfil.' });
    }
  }

  /**
   * Servir imagen de solicitud
   */
  async serveSolicitudImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const solicitud = await SolicitudModel.findById(id);

      if (!solicitud || !solicitud.imagen) {
        res.status(404).json({ success: false, message: 'Imagen de solicitud no encontrada.' });
        return;
      }

      if (solicitud.imagen === 'ImagenEliminada') {
        res.status(410).json({ success: false, message: 'La imagen de solicitud ha sido eliminada.' });
        return;
      }

      const url = await s3Service.getSignedUrl('solicitud', solicitud.imagen);
      res.redirect(url);
    } catch (err) {
      logger.error('Error al servir imagen de solicitud', err as Error);
      res.status(500).json({ success: false, message: 'Error al obtener la imagen de solicitud.' });
    }
  }

  /**
   * Subir imagen de solicitud
   */
  async uploadSolicitudImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const solicitud = await SolicitudModel.findById(id);

      if (!solicitud) {
        res.status(404).json({ success: false, message: 'Solicitud no encontrada.' });
        return;
      }

      const file = req.file;

      if (!file) {
        res.status(400).json({ success: false, message: 'Archivo no proporcionado.' });
        return;
      }

      // Validar el tipo de contenido
      const uploadImageDto = new UploadImageDto();
      uploadImageDto.contentType = file.mimetype;
      const errors = await validate(uploadImageDto);
      if (errors.length > 0) {
        res.status(400).json({ success: false, errors });
        return;
      }

      const folder = 'solicitud';
      const fileName = `${id}-${Date.now()}-${file.originalname}`;

      await s3Service.uploadFile(folder, fileName, file.buffer, file.mimetype);

      solicitud.imagen = fileName;
      await solicitud.save();

      res.status(200).json({ success: true, message: 'Imagen subida con éxito.', fileName });
    } catch (err) {
      logger.error('Error al subir la imagen de solicitud', err as Error);
      res.status(500).json({ success: false, message: 'Error al subir la imagen de solicitud.' });
    }
  }

  /**
   * Eliminar imagen de solicitud
   */
  async deleteSolicitudImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const solicitud = await SolicitudModel.findById(id);

      if (!solicitud || !solicitud.imagen) {
        res.status(404).json({ success: false, message: 'Imagen de solicitud no encontrada.' });
        return;
      }

      await s3Service.deleteFile('solicitud', solicitud.imagen);

      solicitud.imagen = 'ImagenEliminada';
      await solicitud.save();

      res.status(200).json({ success: true, message: 'Imagen eliminada con éxito.' });
    } catch (err) {
      logger.error('Error al eliminar la imagen de solicitud', err as Error);
      res.status(500).json({ success: false, message: 'Error al eliminar la imagen de solicitud.' });
    }
  }
}

export default new S3Controller();
