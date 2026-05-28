[t] Despliegue de una aplicacion Vite con Docker y Nginx

Esta guia explica como tomar una aplicacion creada con Vite, construirla para produccion y servirla con Nginx dentro de un contenedor Docker. Al final lo integramos en un archivo Docker Compose.

[st] Requisitos previos

Antes de empezar, asegurate de tener instalado:

[list]
Node.js (version 18 o superior)
Docker Desktop (o Docker Engine en Linux)
Una aplicacion Vite ya creada
[endlist]

Si aun no tienes una aplicacion Vite, puedes crear una de prueba con:

[code:sh]
npm create vite@latest mi-app -- --template react
cd mi-app
npm install
[endcode]

[st] Paso 1: Construir la aplicacion para produccion

Vite incluye un comando de build que genera archivos estaticos optimizados listos para ser publicados. Estos archivos se guardan en una carpeta llamada `dist`.

Desde la raiz del proyecto ejecuta:

[code:sh]
npm run build
[endcode]

Cuando termine, deberia aparecer una carpeta `dist/` con el contenido listo para produccion. Puedes verificarlo listando su contenido:

[code:sh]
ls dist/
[endcode]

Deberias ver archivos como `index.html` y una subcarpeta `assets/` con los archivos de JavaScript y CSS compilados.

[st] Paso 2: Configurar Nginx

Nginx va a ser el servidor web que sirva los archivos estaticos del build. Necesitamos decirle a Nginx como comportarse: desde que carpeta servir los archivos y como manejar las rutas de la aplicacion.

Crea un archivo llamado `nginx.conf` en la raiz del proyecto con el siguiente contenido:

[code:nginx]
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    error_page 404 /index.html;
}
[endcode]

Por que la linea `try_files $uri $uri/ /index.html`? Las aplicaciones de una sola pagina (SPA) manejan el enrutamiento desde el navegador. Si el usuario visita directamente `/perfil` o `/productos`, Nginx buscaria un archivo con ese nombre en el disco y no lo encontraria. Con esta linea le decimos: "si no encuentras el archivo, devuelve el `index.html` y deja que la aplicacion se encargue del enrutamiento".

[st] Paso 3: Crear el Dockerfile

El `Dockerfile` le dice a Docker como construir la imagen de tu aplicacion. Crea un archivo llamado `Dockerfile` en la raiz del proyecto:

[code:dockerfile]
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
[endcode]

Que hace este Dockerfile paso a paso:

[list]
Etapa 1 (build): usa una imagen de Node para instalar dependencias y ejecutar `npm run build`.
Etapa 2 (final): copia solo los archivos de `dist/` a la imagen de Nginx.
Reemplaza la configuracion de Nginx con nuestro `nginx.conf`.
Expone el puerto 80 y arranca Nginx en primer plano.
[endlist]

La tecnica de usar dos etapas (`FROM ... AS build` y luego otro `FROM`) se llama multi-stage build. Sirve para que la imagen final no incluya Node.js ni el codigo fuente, solo los archivos necesarios para servir la aplicacion. Esto reduce el tamano de la imagen considerablemente.

[st] Paso 4: Construir la imagen Docker

Con el `Dockerfile` listo, construimos la imagen desde la raiz del proyecto:

[code:sh]
docker build -t mi-app-nginx .
[endcode]

[list]
`docker build`: le dice a Docker que construya una imagen.
`-t mi-app-nginx`: le da un nombre (tag) a la imagen. Puedes usar cualquier nombre.
`.`: indica que el `Dockerfile` esta en la carpeta actual.
[endlist]

Para verificar que la imagen se creo correctamente:

[code:sh]
docker images
[endcode]

Deberias ver `mi-app-nginx` en la lista.

[st] Paso 5: Ejecutar el contenedor con docker run

Una vez creada la imagen, la ejecutamos como un contenedor:

[code:sh]
docker run -d -p 8080:80 --name mi-app mi-app-nginx
[endcode]

[list]
`-d`: ejecuta el contenedor en segundo plano (detached mode).
`-p 8080:80`: mapea el puerto 8080 de tu maquina al puerto 80 del contenedor.
`--name mi-app`: le da un nombre al contenedor para poder referenciarlo facilmente.
`mi-app-nginx`: el nombre de la imagen que queremos ejecutar.
[endlist]

Abre el navegador y visita `http://localhost:8080`. Deberia aparecer tu aplicacion.

Comandos utiles para gestionar el contenedor:

[code:sh]
docker ps
docker logs mi-app
docker stop mi-app
docker rm mi-app
[endcode]

[st] Paso 6: Agregar el servicio a Docker Compose

Docker Compose permite definir y ejecutar multiples contenedores de forma declarativa usando un archivo YAML. Es util cuando la aplicacion necesita varios servicios trabajando juntos.

Crea un archivo llamado `docker-compose.yml` en la raiz del proyecto:

[code:yaml]
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: mi-app
    ports:
      - "8080:80"
    restart: unless-stopped
[endcode]

[list]
`services`: agrupa todos los servicios que va a manejar Compose.
`frontend`: nombre del servicio. Puede ser cualquier nombre descriptivo.
`build.context`: le dice a Compose donde encontrar el codigo fuente (`.` es la carpeta actual).
`ports`: mapeo de puertos, igual que en `docker run -p`.
`restart: unless-stopped`: el contenedor se reinicia automaticamente si falla, a menos que lo hayas detenido manualmente.
[endlist]

Para construir la imagen y arrancar el servicio:

[code:sh]
docker compose up --build -d
[endcode]

Para detener y eliminar los contenedores:

[code:sh]
docker compose down
[endcode]

Para ver los logs:

[code:sh]
docker compose logs frontend
[endcode]

[st] Estructura final del proyecto

Al terminar, la raiz de tu proyecto deberia verse asi:

[code:plain]
mi-app/
├── dist/               <- generado por npm run build
├── node_modules/
├── public/
├── src/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
└── index.html
[endcode]

[st] Resumen del flujo completo

[mermaid]
flowchart TD
    A[Codigo fuente Vite] --> B[npm run build → carpeta dist/]
    B --> C[Dockerfile - multi-stage build]
    C --> D[docker build → imagen con Nginx]
    D --> E[docker run → contenedor en localhost:8080]
    E --> F[docker compose → gestion declarativa con YAML]
[endmermaid]

[st] Errores comunes

La aplicacion carga pero las rutas dan error 404: Verifica que el archivo `nginx.conf` tenga la linea `try_files $uri $uri/ /index.html;` dentro del bloque `location /`.

El puerto 8080 ya esta en uso: Cambia el puerto en el comando `docker run` o en el `docker-compose.yml`. Por ejemplo, usa `9090:80` para exponer en el puerto 9090.

La imagen no se actualiza despues de cambiar el codigo: Cuando cambias el codigo fuente, debes reconstruir la imagen. Con Docker Compose usa `docker compose up --build`. Con docker run, primero elimina la imagen anterior con `docker rmi mi-app-nginx` y luego vuelve a ejecutar `docker build`.

El contenedor se detiene inmediatamente: Revisa los logs con `docker logs mi-app`. Lo mas probable es que Nginx encontro un error en la configuracion. Verifica la sintaxis del archivo `nginx.conf`.
