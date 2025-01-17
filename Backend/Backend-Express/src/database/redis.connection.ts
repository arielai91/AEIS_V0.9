import { createClient, RedisClientType } from 'redis';
import RedisConfig from '@config/redis.config';
import Logger from '@logger/logger';
import ConnectionError from '@errors/connection-error';
import TimeoutError from '@errors/timeout-error';
import DatabaseError from '@errors/database-error';

class RedisConnection {
    private client: RedisClientType;
    private maxRetries: number;
    private retryInterval: number;

    constructor(maxRetries = 5, retryInterval = 2000) {
        this.client = createClient({
            url: RedisConfig.redisUrl,
        });
        this.maxRetries = maxRetries;
        this.retryInterval = retryInterval;
        this.setupConnectionEvents();
    }

    public async connect(): Promise<void> {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                await this.client.connect();
                Logger.info('Cliente Redis conectado correctamente.');
                return;
            } catch (err) {
                retries++;
                if (err instanceof Error) {
                    Logger.error(`No se pudo conectar a Redis (Intento ${retries}/${this.maxRetries})`, err);
                    if (retries >= this.maxRetries) {
                        if (err.message.includes('ETIMEDOUT')) {
                            throw new TimeoutError('No se pudo conectar a Redis debido a un tiempo de espera');
                        } else {
                            throw new ConnectionError('No se pudo conectar a Redis después de varios intentos');
                        }
                    }
                } else {
                    Logger.error(`No se pudo conectar a Redis (Intento ${retries}/${this.maxRetries})`, new Error('Error desconocido'));
                    throw new ConnectionError('No se pudo conectar a Redis después de varios intentos');
                }
                await this.delay(this.retryInterval);
            }
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.client.disconnect();
            Logger.info('Cliente Redis desconectado correctamente.');
        } catch (err) {
            if (err instanceof Error) {
                Logger.error('Error al desconectar de Redis', err);
                throw new DatabaseError('Error al desconectar de Redis');
            } else {
                Logger.error('Error al desconectar de Redis', new Error('Error desconocido'));
                throw new DatabaseError('Error al desconectar de Redis');
            }
        }
    }

    private setupConnectionEvents(): void {
        this.client.on('connect', () => {
            Logger.info('Conexión exitosa a Redis');
        });

        this.client.on('error', (err: Error) => {
            Logger.error('Error en Redis:', err);
        });

        process.on('SIGINT', async () => {
            await this.disconnect();
            process.exit(0);
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}

const redisConnection = new RedisConnection();
export default redisConnection;