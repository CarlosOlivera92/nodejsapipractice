# Usar la imagen oficial de Node.js como base
FROM node:16.17.1-alpine3.16

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

COPY package*.json ./

# Copiar el resto de los archivos de la aplicación
COPY . .

# Instalar las dependencias del proyecto
RUN npm install

# Exponer el puerto en el que corre tu aplicación
EXPOSE 3000

# Definir las variables de entorno
ENV PRIVATE_KEY_JWT=coder47300
ENV PERSISTENCE=MONGO
ENV MONGO_URL=mongodb+srv://CarlosOlivera:UbivgxwgeHeqtRRU@cluster0.ddubnhh.mongodb.net/ecommerce?retryWrites=true&w=majority
ENV NODE_ENV=development
ENV ERROR_LOG_FILE=errors.log
ENV PORT=3306

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
