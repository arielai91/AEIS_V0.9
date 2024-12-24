# Backend-Flask

Esta carpeta contiene el código relacionado con el backend desarrollado con **Flask** y **Python**. Su propósito principal es manejar la lógica del sistema y proporcionar una API para la aplicación.

## Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

```
Backend-Flask/
├── app/
│   ├── routes/            # Definición de rutas para la API
│   ├── services/          # Servicios y lógica de negocio
│   ├── __init__.py        # Inicialización de la aplicación Flask
│   ├── config.py          # Configuración de la aplicación
│   └── extensions.py      # Extensiones de Flask (e.g., base de datos, autenticación)
├── tests/                 # Pruebas unitarias y de integración
├── .env                   # Variables de entorno
├── .gitignore             # Archivos y carpetas ignorados por Git
├── README.md              # Documentación del proyecto
├── requirements.txt       # Dependencias del proyecto
├── run.py                 # Archivo principal para iniciar la aplicación
```

## Características Principales

- **Definición de Rutas**: Endpoints diseñados para interactuar con el frontend y otros servicios.
- **Servicios y Lógica**: Lógica central organizada en la carpeta `services`.
- **Pruebas**: Configuración para pruebas unitarias y de integración.

## Configuración

### 1. Instalación de Dependencias

Asegúrate de tener **Python 3** instalado en tu sistema. Luego, instala las dependencias necesarias con:

```bash
pip install -r requirements.txt
```

### 2. Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables según sea necesario:

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=<tu_clave_secreta>
DATABASE_URL=<url_de_tu_base_de_datos>
```

### 3. Iniciar el Servidor

Ejecuta el servidor utilizando el siguiente comando:

```bash
flask run
```

El servidor estará disponible en: `http://localhost:5000`

## Estructura de Servicios

- `config.py`: Contiene las configuraciones globales para la aplicación.
- `extensions.py`: Maneja la inicialización de extensiones como la base de datos o autenticación.
