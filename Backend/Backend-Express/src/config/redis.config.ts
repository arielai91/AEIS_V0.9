import dotenv from 'dotenv';
import Logger from '@logger/logger';
import ConfigError from '@errors/config-error';

dotenv.config();

class RedisConfig {
    public redisUrl: string;

    constructor() {
        this.redisUrl = process.env.REDIS_URL || '';

        if (!this.redisUrl) {
            Logger.error('No se ha definido la variable de entorno REDIS_URL');
            throw new ConfigError('No se ha definido la variable de entorno REDIS_URL');
        }
    }
}

export default new RedisConfig();