// Configuraciones Generales
export const APP_NAME = 'MyApp';
export const APP_VERSION = '1.0.0';

export const AUTH0_AUDIENCE = 'your-auth0-audience';
export const AUTH0_DOMAIN = 'your-auth0-domain';

// Mensajes de Error
export const ERROR_MESSAGES = {
  DATABASE_CONNECTION: 'Error al conectar a la base de datos',
  NOT_FOUND: 'Recurso no encontrado',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Prohibido',
  SERVER_ERROR: 'Error interno del servidor',
};

// Códigos de Estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Rutas de la API
export const API_ROUTES = {
  PERFILES: '/perfiles',
  CASILLEROS: '/casilleros',
  PLANES: '/planes',
  S3: '/bucket',
  CSRF: '/csrf',
  SOLICITUDES: '/solicitudes',
};