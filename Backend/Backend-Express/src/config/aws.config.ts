import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import logger from '@logger/logger';

dotenv.config();

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    logger.error('Faltan configuraciones de AWS en las variables de entorno.');
    throw new Error('Faltan configuraciones de AWS.');
}

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export default s3;