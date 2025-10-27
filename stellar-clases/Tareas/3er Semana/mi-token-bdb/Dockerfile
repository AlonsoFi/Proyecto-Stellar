# Dockerfile para build de la DApp Token BDB
FROM node:22-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias (incluyendo dev dependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Crear build de producción
RUN npm run build

# Exponer puerto (opcional, para preview)
EXPOSE 4173

# Comando por defecto para servir el build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
