# Usa una imagen base de Python
FROM python:3.9-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de dependencias (requirements.txt)
COPY requirements.txt .

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Expone el puerto donde se ejecutará Flask
EXPOSE 5000

# Comando para iniciar Flask
CMD ["python", "run.py"]
