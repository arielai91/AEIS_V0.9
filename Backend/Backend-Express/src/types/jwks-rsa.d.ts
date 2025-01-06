declare module 'jwks-rsa' {
    import { GetVerificationKey, SecretCallback, SigningKeyCallback } from 'jsonwebtoken';

    export function expressJwtSecret(options: {
        cache?: boolean;
        rateLimit?: boolean;
        jwksRequestsPerMinute?: number;
        jwksUri: string;
    }): GetVerificationKey;

    export class JwksClient {
        constructor(options: {
            cache?: boolean;
            rateLimit?: boolean;
            jwksRequestsPerMinute?: number;
            jwksUri: string;
        });

        getSigningKey(kid: string, cb: SigningKeyCallback): void;
        getSigningKeyAsync(kid: string): Promise<SecretCallback>;
    }
}