# Frontend-Angular

Esta carpeta contiene el código del frontend desarrollado con **Angular**. Su propósito es proporcionar una interfaz de usuario moderna, interactiva y altamente personalizable.

## Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

```
Frontend-Angular/
├── .angular/              # Archivos temporales generados por Angular CLI
├── .vscode/               # Configuración del entorno de desarrollo para Visual Studio Code
├── node_modules/          # Módulos instalados de Node.js
├── public/                # Archivos públicos como imágenes o assets
├── src/                   # Código fuente principal de la aplicación Angular
├── .editorconfig          # Configuración de estilo de código
├── .gitignore             # Archivos y carpetas ignorados por Git
├── angular.json           # Configuración global del proyecto Angular
├── package.json           # Dependencias y scripts del proyecto
├── package-lock.json      # Versión fija de las dependencias
├── postcss.config.js      # Configuración de PostCSS para estilos
├── tailwind.config.js     # Configuración de Tailwind CSS
├── tsconfig.app.json      # Configuración de TypeScript para la aplicación
├── tsconfig.json          # Configuración global de TypeScript
├── tsconfig.spec.json     # Configuración de TypeScript para pruebas
├── README.md              # Documentación del proyecto
```

## Características Principales

- **Angular CLI**: Utilizado para la gestión y configuración del proyecto.
- **Tailwind CSS**: Framework de utilidades para diseñar interfaces de usuario rápidas y personalizables.
- **PostCSS**: Procesamiento avanzado de estilos CSS.
- **Modularidad**: Código organizado en módulos y componentes reutilizables.
- **Soporte para Pruebas**: Configuración lista para pruebas unitarias y de integración.

## Configuración

### 1. Requisitos Previos

Asegúrate de tener instalados:

- **Node.js** (versión 14 o superior)
- **Angular CLI** (versión 13 o superior)

### 2. Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias necesarias:

```bash
npm install
```

### 3. Iniciar el Servidor de Desarrollo

Ejecuta el servidor de desarrollo utilizando el siguiente comando:

```bash
npm start
```

Por defecto, el servidor estará disponible en: `http://localhost:4200`.

### 4. Generar una Construcción para Producción

Para generar una versión optimizada del proyecto, ejecuta:

```bash
npm build
```

El resultado se generará en la carpeta `dist/`.

## Estructura Principal de la Carpeta `src`

- `src/app/`: Contiene los módulos y componentes principales de la aplicación.

## Configuración de Estilos

Este proyecto utiliza **Tailwind CSS** para el diseño. La configuración se encuentra en el archivo `tailwind.config.js` y se complementa con `postcss.config.js` para un procesamiento avanzado de estilos.
