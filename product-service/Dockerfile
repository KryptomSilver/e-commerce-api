# --- ETAPA 1: Builder ---
# En esta etapa instalamos todo, compilamos el código y preparamos los artefactos.
FROM node:20.14.0 AS builder

WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY product-service/package.json product-service/package-lock.json ./

# Copyamos el protocolo gRPC en la carpeta proto/product.proto que esta fuera del proyecto
COPY proto/products.proto ./proto/products.proto

# Instalamos TODAS las dependencias, incluidas las de desarrollo para poder compilar
RUN npm install

# Copiamos el resto del código fuente
COPY product-service/. .

# Compilamos la aplicación
RUN npm run build

# --- ETAPA 2: Production ---
# Esta es la imagen final. Será mucho más pequeña y segura.
FROM node:20.14.0 AS production

WORKDIR /app

# Copiamos solo el package.json y package-lock.json
COPY product-service/package.json product-service/package-lock.json ./

# Instalamos ÚNICAMENTE las dependencias de producción
RUN npm install --production

# Copiamos el código compilado desde la etapa "builder"
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/proto/products.proto ./proto/products.proto

# Exponemos el puerto de la aplicación
EXPOSE 5001

# Comando para iniciar la aplicación directamente con Node (más robusto)
CMD ["node", "dist/main"]
