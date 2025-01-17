// utils/token.utils.ts
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const accessTokenTTL = process.env.JWT_ACCESS_TOKEN_TTL || '15m';
const refreshTokenTTL = process.env.JWT_REFRESH_TOKEN_TTL || '604800'; // 7 días en segundos
const csrfTokenTTL = process.env.CSRF_TOKEN_TTL || '900'; // 15 minutos en segundos

/**
 * Genera un Access Token con un tiempo de vida corto (configurable).
 * @param payload Información a incluir en el token (e.g., { userId }).
 * @returns El Access Token generado.
 */
export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: accessTokenTTL, // Tiempo de vida del Access Token
    });
};

/**
 * Genera un Refresh Token con un tiempo de vida largo (configurable).
 * @returns El Refresh Token generado.
 */
export const generateRefreshToken = (): string => {
    return randomBytes(64).toString('hex'); // Refresh Token seguro y único
};

/**
 * Genera un CSRF Token con un valor aleatorio.
 * @returns El CSRF Token generado.
 */
export const generateCsrfToken = (): string => {
    return randomBytes(32).toString('hex'); // CSRF Token único y aleatorio
};

/**
 * Devuelve el tiempo de vida en segundos para un token CSRF.
 * @returns El TTL del CSRF Token en segundos.
 */
export const getCsrfTokenTTL = (): number => parseInt(csrfTokenTTL, 10);

/**
 * Devuelve el tiempo de vida en segundos para un Refresh Token.
 * @returns El TTL del Refresh Token en segundos.
 */
export const getRefreshTokenTTL = (): number => parseInt(refreshTokenTTL, 10);