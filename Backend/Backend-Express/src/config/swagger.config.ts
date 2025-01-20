import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.1', // Especificación de OpenAPI
        info: {
            title: 'API Documentation', // Título de la documentación
            version: '1.0.0', // Versión de tu API
            description: 'Documentación de la API con Swagger para Express.', // Descripción de la API
            contact: {
                name: 'Ariel', // Nombre del contacto
                email: 'ariel.amaguana@epn.edu.ec', // Correo del contacto
            },
            license: {
                name: 'MIT', // Licencia de tu API
                url: 'https://opensource.org/licenses/MIT', // URL de la licencia
            },
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL del servidor local
                description: 'Servidor de desarrollo',
            },
            {
                url: 'https://api.tu-dominio.com', // URL del servidor de producción
                description: 'Servidor de producción',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Especifica que es un token JWT
                },
            },
        },
        security: [
            {
                bearerAuth: [], // Aplica la seguridad Bearer JWT a toda la API
            },
        ],
        tags: [
            {
                name: 'Auth', // Nombre del grupo de rutas
                description: 'Operaciones relacionadas con la autenticación',
            },
            {
                name: 'Perfiles', // Otro grupo de rutas
                description: 'Operaciones relacionadas con los perfiles de usuario',
            },
        ],
    },
    apis: [
        './src/routes/*.ts', // Archivos donde están las rutas (anotaciones @swagger)
        './src/dtos/*.ts',   // Archivos donde están los DTOs
    ],
};

export default swaggerOptions;