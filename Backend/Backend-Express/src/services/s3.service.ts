// s3.service.ts
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3 from '@config/aws.config';
import logger from '@logger/logger';

class S3Service {
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME!;
    }

    async ensureFolderExists(folder: string): Promise<void> {
        try {
            const command = new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: `${folder}/`,
                MaxKeys: 1,
            });

            const result = await s3.send(command);

            if (!result.Contents || result.Contents.length === 0) {
                const createFolderCommand = new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: `${folder}/`,
                    Body: '',
                });

                await s3.send(createFolderCommand);
                logger.info(`Carpeta creada en S3: ${folder}`);
            }
        } catch (err) {
            logger.error('Error al verificar o crear carpeta en S3', err as Error);
            throw err;
        }
    }

    async uploadFile(folder: string, fileName: string, fileBuffer: Buffer, contentType: string): Promise<void> {
        try {
            await this.ensureFolderExists(folder);

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: `${folder}/${fileName}`,
                Body: fileBuffer,
                ContentType: contentType,
            });

            await s3.send(command);
            logger.info(`Archivo subido a S3: ${folder}/${fileName}`);
        } catch (err) {
            logger.error('Error al subir archivo a S3', err as Error);
            throw err;
        }
    }

    async deleteFile(folder: string, fileName: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: `${folder}/${fileName}`,
            });

            await s3.send(command);
            logger.info(`Archivo eliminado de S3: ${folder}/${fileName}`);
        } catch (err) {
            logger.error('Error al eliminar archivo de S3', err as Error);
            throw err;
        }
    }

    async getSignedUrl(folder: string, fileName: string): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: `${folder}/${fileName}`,
            });

            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            logger.info(`URL firmada generada para S3: ${folder}/${fileName}`);
            return url;
        } catch (err) {
            logger.error('Error al generar URL firmada para S3', err as Error);
            throw err;
        }
    }
}

export default new S3Service();