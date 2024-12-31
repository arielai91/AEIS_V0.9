from app import app
from app.scheduler import start_scheduler

if __name__ == '__main__':
    start_scheduler()  # Inicia el planificador de tareas
    # Inicia la aplicación en el puerto 5000
    app.run(host='127.0.0.1', port=5000, debug=app.config['DEBUG'])
