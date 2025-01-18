import { Request, Response } from 'express';
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from '@config/aws.config';
import PerfilModel from '@models/Perfil/Perfil';
import { Readable } from 'stream';

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
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `static/${fileName}`,
      });

      const data = await s3.send(command);
      res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
      (data.Body as Readable).pipe(res);
    } catch {
      res.status(404).json({ message: 'Imagen estática no encontrada.' });
    }
  }

  async servePerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'No autorizado.' });
        return;
      }

      const perfil = await PerfilModel.findById(userId);

      if (!perfil || !perfil.imagen) {
        res.status(404).json({ message: 'Imagen de perfil no encontrada.' });
        return;
      }

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `perfil/${perfil.imagen}`,
      });

      const data = await s3.send(command);
      res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
      (data.Body as Readable).pipe(res);
    } catch {
      res.status(500).json({ message: 'Error al obtener la imagen de perfil.' });
    }
  }

  async uploadPerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'No autorizado.' });
        return;
      }

      const file = req.file;

      if (!file) {
        res.status(400).json({ message: 'Archivo no proporcionado.' });
        return;
      }

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `perfil/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      await PerfilModel.findByIdAndUpdate(userId, { imagen: file.originalname });

      res.status(200).json({ message: 'Imagen subida con éxito.' });
    } catch {
      res.status(500).json({ message: 'Error al subir la imagen de perfil.' });
    }
  }

  async deletePerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'No autorizado.' });
        return;
      }

      const perfil = await PerfilModel.findById(userId);

      if (!perfil || !perfil.imagen) {
        res.status(404).json({ message: 'Imagen de perfil no encontrada.' });
        return;
      }

      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `perfil/${perfil.imagen}`,
      });

      await s3.send(command);

      await PerfilModel.findByIdAndUpdate(userId, { imagen: null });

      res.status(200).json({ message: 'Imagen eliminada con éxito.' });
    } catch {
      res.status(500).json({ message: 'Error al eliminar la imagen de perfil.' });
    }
  }

  async updatePerfilImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'No autorizado.' });
        return;
      }

      const file = req.file;

      if (!file) {
        res.status(400).json({ message: 'Archivo no proporcionado.' });
        return;
      }

      const perfil = await PerfilModel.findById(userId);

      if (!perfil || !perfil.imagen) {
        res.status(404).json({ message: 'Perfil no encontrado o sin imagen previa.' });
        return;
      }

      // Eliminar la imagen anterior del bucket
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `perfil/${perfil.imagen}`,
      });

      await s3.send(deleteCommand);

      // Subir la nueva imagen
      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `perfil/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(putCommand);

      // Actualizar el perfil con la nueva imagen
      await PerfilModel.findByIdAndUpdate(userId, { imagen: file.originalname });

      res.status(200).json({ message: 'Imagen de perfil actualizada con éxito.' });
    } catch {
      res.status(500).json({ message: 'Error al actualizar la imagen de perfil.' });
    }
  }
}

export default new S3Controller();