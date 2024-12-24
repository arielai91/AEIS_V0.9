# Backend-Express

Esta carpeta contiene el código relacionado con el backend desarrollado con **Express** y **Node.js**. El propósito principal de este backend es gestionar la base de datos MongoDB y proporcionar una API robusta para realizar operaciones CRUD.

## Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

```
Backend-Express/
├── src/
│   ├── config/           # Configuración general de la aplicación
│   ├── controllers/      # Lógica de negocio y manejo de solicitudes
│   ├── database/         # Configuración y conexión a MongoDB
│   ├── errors/           # Manejo de errores personalizados
│   ├── logs/             # Configuración y generación de logs
│   ├── middlewares/      # Middlewares personalizados para validación y autenticación
│   ├── models/           # Esquemas y modelos de MongoDB
│   ├── routes/           # Definición de rutas de la API
│   ├── services/         # Servicios para lógica adicional o conexión externa
│   ├── tests/            # Pruebas unitarias y de integración
│   ├── types/            # Definiciones de tipos TypeScript
│   ├── utils/            # Funciones auxiliares y utilidades
│   ├── validations/      # Validaciones para datos de entrada
│   ├── app.ts            # Configuración principal de la aplicación Express
│   └── server.ts         # Archivo de inicio del servidor
├── .env                  # Variables de entorno
├── .gitignore            # Archivos y carpetas ignorados por Git
├── package.json          # Dependencias y scripts del proyecto
├── tsconfig.json         # Configuración de TypeScript
├── README.md             # Documentación del proyecto
```

## Características Principales

- **Gestión de MongoDB**: Conexión y operaciones CRUD.
- **Rutas API RESTful**: Endpoints diseñados para interactuar con la base de datos y la aplicación.
- **Validaciones**: Validación de datos de entrada utilizando middlewares.
- **Pruebas**: Estructura para pruebas unitarias y de integración.
- **Logs**: Generación y almacenamiento de logs de eventos.

## Configuración

### 1. Instalación de Dependencias

Asegúrate de tener **Node.js** instalado en tu sistema. Luego, instala las dependencias necesarias con:

```bash
npm install
```

### 2. Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:

```env
MONGO_URI=<tu_conexion_a_mongodb>
PORT=3000
```

### 3. Iniciar el Servidor

Ejecuta el servidor utilizando el siguiente comando:

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`
