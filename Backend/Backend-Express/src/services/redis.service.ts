import redisConnection from '@database/redis.connection';

class RedisService {
    /**
     * Guarda un valor en Redis con un TTL (tiempo de vida en segundos).
     * @param key Clave que identifica el dato.
     * @param value Valor a almacenar.
     * @param ttl Tiempo de vida en segundos.
     */
    public async setKey(key: string, value: string, ttl: number): Promise<void> {
        try {
            const client = redisConnection.getClient();
            await client.setEx(key, ttl, value);
        } catch (err) {
            throw new Error(`Error al guardar la clave ${key} en Redis: ${(err as Error).message}`);
        }
    }

    /**
     * Obtiene el valor asociado a una clave en Redis.
     * @param key Clave que identifica el dato.
     * @returns El valor asociado a la clave, o null si no existe.
     */
    public async getKey(key: string): Promise<string | null> {
        try {
            const client = redisConnection.getClient();
            return await client.get(key);
        } catch (err) {
            throw new Error(`Error al obtener la clave ${key} de Redis: ${(err as Error).message}`);
        }
    }

    /**
     * Elimina una clave en Redis.
     * @param key Clave que identifica el dato.
     */
    public async deleteKey(key: string): Promise<void> {
        try {
            const client = redisConnection.getClient();
            await client.del(key);
        } catch (err) {
            throw new Error(`Error al eliminar la clave ${key} en Redis: ${(err as Error).message}`);
        }
    }

    /**
     * Obtiene el TTL (tiempo de vida en segundos) de una clave en Redis.
     * @param key Clave en Redis.
     * @returns Tiempo de vida en segundos. Si la clave no tiene TTL, devuelve -1.
     */
    public async getTTL(key: string): Promise<number> {
        try {
            const client = redisConnection.getClient();
            return await client.ttl(key);
        } catch (err) {
            throw new Error(`Error al obtener el TTL de la clave ${key}: ${(err as Error).message}`);
        }
    }

    /**
     * Guarda un hash en Redis con un TTL.
     * @param key Clave que identifica el hash.
     * @param fields Campos a guardar en el hash.
     * @param ttl Tiempo de vida en segundos.
     */
    public async setHashWithTTL(key: string, fields: Record<string, string | number>, ttl: number): Promise<void> {
        try {
            const client = redisConnection.getClient();
            await client.hSet(key, fields);
            await client.expire(key, ttl); // Asigna el TTL al hash
        } catch (err) {
            throw new Error(`Error al guardar hash ${key} con TTL en Redis: ${(err as Error).message}`);
        }
    }

    public async getHash(key: string): Promise<Record<string, string>> {
        try {
            const client = redisConnection.getClient();
            return await client.hGetAll(key);
        } catch (err) {
            throw new Error(`Error al obtener hash ${key} de Redis: ${(err as Error).message}`);
        }
    }

    public async expireKey(key: string, ttl: number): Promise<void> {
        try {
            const client = redisConnection.getClient();
            await client.expire(key, ttl);
        } catch (err) {
            throw new Error(`Error al configurar TTL para la clave ${key}: ${(err as Error).message}`);
        }
    }
}

export default new RedisService();