import {
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3 from '@config/aws.config';

class S3Service {
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME!;
    }

    /**
     * Verifica si una carpeta (prefijo) existe en S3, si no, la crea.
     * @param folder Nombre de la carpeta.
     */
    async ensureFolderExists(folder: string): Promise<void> {
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
        }
    }

    /**
     * Sube un archivo a S3.
     * @param folder Carpeta en el bucket.
     * @param fileName Nombre del archivo.
     * @param fileBuffer Contenido del archivo en Buffer.
     * @param contentType Tipo MIME del archivo.
     */
    async uploadFile(folder: string, fileName: string, fileBuffer: Buffer, contentType: string): Promise<void> {
        await this.ensureFolderExists(folder);

        const key = `${folder}/${fileName}`;
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
            ACL: folder === 'static' ? 'public-read' as ObjectCannedACL : 'private' as ObjectCannedACL,
        };
        await s3.send(new PutObjectCommand(params));
    }

    /**
     * Obtiene una URL firmada para acceder a un archivo.
     * @param folder Carpeta en el bucket.
     * @param fileName Nombre del archivo.
     */
    async getSignedUrl(folder: string, fileName: string): Promise<string> {
        const key = `${folder}/${fileName}`;
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };
        const command = new GetObjectCommand(params);
        return getSignedUrl(s3, command, { expiresIn: 3600 });
    }

    /**
     * Elimina un archivo de S3.
     * @param folder Carpeta en el bucket.
     * @param fileName Nombre del archivo.
     */
    async deleteFile(folder: string, fileName: string): Promise<void> {
        const key = `${folder}/${fileName}`;
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };
        await s3.send(new DeleteObjectCommand(params));
    }
}

export default new S3Service();