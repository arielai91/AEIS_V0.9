import Logger from '@logger/logger';

type EnvVariableDefault = string | number | boolean;

interface EnvValidationConfig {
    [key: string]:
    | boolean // Validación básica: requerido (true/false)
    | {
        required?: boolean; // Indica si la variable es obligatoria
        default?: EnvVariableDefault; // Valor predeterminado si no está definido
        type?: 'string' | 'number' | 'boolean'; // Tipo esperado
    };
}

export const validateEnvVariables = (config: EnvValidationConfig): void => {
    const missingVariables: string[] = [];
    const typeErrors: string[] = [];

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

            // Validar tipo de dato si está definido
            if (value && settings.type) {
                switch (settings.type) {
                    case 'number':
                        if (isNaN(Number(value))) {
                            typeErrors.push(`${variable} should be a number, got: ${value}`);
                        }
                        break;
                    case 'boolean':
                        if (value !== 'true' && value !== 'false') {
                            typeErrors.push(`${variable} should be a boolean, got: ${value}`);
                        }
                        break;
                }
            }

            // Asignar un valor predeterminado si no está definido
            if (!value && settings.default !== undefined) {
                process.env[variable] = String(settings.default);
                Logger.info(
                    `Environment variable ${variable} is missing. Using default value: ${settings.default}`
                );
            }
        }
    });

    // Lanzar errores si faltan variables
    if (missingVariables.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
    }

    // Lanzar errores si hay variables con tipos incorrectos
    if (typeErrors.length > 0) {
        throw new Error(`Invalid types for environment variables:\n${typeErrors.join('\n')}`);
    }

    Logger.info('Environment variables validated successfully.');
};