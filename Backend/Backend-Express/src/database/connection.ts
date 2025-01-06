import mongoose from 'mongoose';
import DatabaseConfig from '@config/database.config';
import Logger from '@logger/logger';
import ConnectionError from '@errors/connection-error';
import TimeoutError from '@errors/timeout-error';
import DatabaseError from '@errors/database-error';

class DatabaseConnection {
  private config: typeof DatabaseConfig;
  private maxRetries: number;
  private retryInterval: number;

  constructor(config: typeof DatabaseConfig, maxRetries = 5, retryInterval = 2000) {
    this.config = config;
    this.maxRetries = maxRetries;
    this.retryInterval = retryInterval;
  }

  public async connect(): Promise<void> {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        await mongoose.connect(this.config.mongoUri, this.config.mongooseOptions);
        Logger.info('Conectado a MongoDB');
        this.setupConnectionEvents();
        return;
      } catch (err) {
        retries++;
        if (err instanceof Error) {
          Logger.error(`No se pudo conectar a MongoDB (Intento ${retries}/${this.maxRetries})`, err);
          if (retries >= this.maxRetries) {
            if (err.name === 'MongoTimeoutError') {
              throw new TimeoutError('No se pudo conectar a MongoDB debido a un tiempo de espera');
            } else {
              throw new ConnectionError('No se pudo conectar a MongoDB después de varios intentos');
            }
          }
        } else {
          Logger.error(`No se pudo conectar a MongoDB (Intento ${retries}/${this.maxRetries})`, new Error('Error desconocido'));
          throw new ConnectionError('No se pudo conectar a MongoDB después de varios intentos');
        }
        await this.delay(this.retryInterval);
      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      Logger.info('Desconectado de MongoDB');
    } catch (err) {
      if (err instanceof Error) {
        Logger.error('Error al desconectar de MongoDB', err);
        throw new DatabaseError('Error al desconectar de MongoDB');
      } else {
        Logger.error('Error al desconectar de MongoDB', new Error('Error desconocido'));
        throw new DatabaseError('Error al desconectar de MongoDB');
      }
    }
  }

  private setupConnectionEvents(): void {
    mongoose.connection.on('connected', () => {
      Logger.info('Mongoose conectado a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      Logger.error('Error en la conexión de Mongoose', err);
    });

    mongoose.connection.on('disconnected', () => {
      Logger.info('Mongoose desconectado de MongoDB');
    });

    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const databaseConnection = new DatabaseConnection(DatabaseConfig);
export default databaseConnection;