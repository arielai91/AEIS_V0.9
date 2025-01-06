import { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import Logger from '@logger/logger';
import ConfigError from '@errors/config-error';

dotenv.config();

class DatabaseConfig {
  public mongoUri: string;
  public mongooseOptions: ConnectOptions;

  constructor() {
    this.mongoUri = process.env.MONGODB_URI || '';
    this.mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    };

    if (!this.mongoUri) {
      Logger.error('No se ha definido la variable de entorno MONGODB_URI');
      throw new ConfigError('No se ha definido la variable de entorno MONGODB_URI');
    }
  }
}

export default new DatabaseConfig();