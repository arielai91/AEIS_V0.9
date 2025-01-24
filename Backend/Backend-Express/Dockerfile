# Usa una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del proyecto al contenedor
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "run", "dev"]
