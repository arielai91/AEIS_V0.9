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
     * Guarda un objeto JSON en Redis como un hash.
     * @param key Clave que identifica el hash.
     * @param fields Campos a guardar en el hash.
     */
    public async setHash(key: string, fields: Record<string, string>): Promise<void> {
        try {
            const client = redisConnection.getClient();
            await client.hSet(key, fields);
        } catch (err) {
            throw new Error(`Error al guardar hash ${key} en Redis: ${(err as Error).message}`);
        }
    }

    /**
     * Obtiene los campos de un hash en Redis.
     * @param key Clave que identifica el hash.
     * @returns Campos del hash como un objeto.
     */
    public async getHash(key: string): Promise<Record<string, string>> {
        try {
            const client = redisConnection.getClient();
            return await client.hGetAll(key);
        } catch (err) {
            throw new Error(`Error al obtener hash ${key} de Redis: ${(err as Error).message}`);
        }
    }

    /**
     * Obtiene un valor asociado a una clave en Redis.
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
     * Incrementa el valor de una clave numérica.
     * @param key Clave que identifica el dato.
     * @returns El nuevo valor incrementado.
     */
    public async incrementKey(key: string): Promise<number> {
        try {
            const client = redisConnection.getClient();
            return await client.incr(key);
        } catch (err) {
            throw new Error(`Error al incrementar la clave ${key} en Redis: ${(err as Error).message}`);
        }
    }

    /**
     * Lista todas las claves en Redis que coincidan con un patrón.
     * @param pattern Patrón para buscar claves (por ejemplo, `user:*`).
     * @returns Una lista de claves que coinciden con el patrón.
     */
    public async listKeys(pattern: string): Promise<string[]> {
        try {
            const client = redisConnection.getClient();
            return await client.keys(pattern);
        } catch (err) {
            throw new Error(`Error al listar claves con el patrón ${pattern} en Redis: ${(err as Error).message}`);
        }
    }
}

export default new RedisService();