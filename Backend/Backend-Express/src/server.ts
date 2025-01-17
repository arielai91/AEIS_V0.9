import ServerConfig from '@config/server';
import databaseConnection from '@database/connection';
import logger from '@logger/logger';
import redisConnection from '@database/redis.connection';

class AppServer {
  private serverConfig: ServerConfig;

  constructor() {
    this.serverConfig = new ServerConfig();
  }

  public async start(): Promise<void> {
    try {
      await databaseConnection.connect();
      await redisConnection.connect();
      const port = parseInt(process.env.PORT || '3000', 10);

      this.serverConfig.app.listen(port, '0.0.0.0', () => {
        logger.info(`Servidor escuchando en http://0.0.0.0:${port}`);
      });
    } catch (err) {
      logger.error('Error al iniciar el servidor', err as Error);
      process.exit(1);
    }
  }
}

export default AppServer;