import Logger from '@logger/logger';

type EnvVariableDefault = string | number | boolean;

interface EnvValidationConfig {
    [key: string]: boolean | { required?: boolean; default?: EnvVariableDefault };
}

export const validateEnvVariables = (config: EnvValidationConfig): void => {
    const missingVariables: string[] = [];

    Object.entries(config).forEach(([variable, settings]) => {
        const value = process.env[variable];

        if (typeof settings === 'boolean' && settings) {
            // Configuración básica: la variable es requerida
            if (!value) {
                missingVariables.push(variable);
            }
        } else if (typeof settings === 'object') {
            // Configuración avanzada
            if (settings.required && !value) {
                missingVariables.push(variable);
            }

            // Asignar un valor predeterminado si no está definido
            if (!value && settings.default !== undefined) {
                process.env[variable] = String(settings.default);
                Logger.info(`Environment variable ${variable} is missing. Using default value: ${settings.default}`);
            }
        }
    });

    if (missingVariables.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
    }

    Logger.info('Environment variables validated successfully.');
};