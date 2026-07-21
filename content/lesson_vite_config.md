# Configuracion de Vite: Alias y Proxy

Vite expone un archivo `vite.config.js` que permite personalizar el comportamiento del bundler y del servidor de desarrollo. En esta leccion configuramos dos cosas utiles para cualquier proyecto: alias de rutas para imports mas limpios y un proxy para comunicarse con el backend sin problemas de CORS.

## Alias de rutas con @

Cuando el proyecto crece, los imports relativos se vuelven dificiles de leer y de mantener.

Sin alias, un import tipico desde un componente anidado se ve asi:

```js
import { authService } from '../../../services/authService';
import { Button } from '../../components/ui/Button';
```

Si mueves el archivo a otra carpeta, todos esos `../` se rompen. Con un alias `@` que apunta a `src/`, el mismo import queda:

```js
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
```

El path es absoluto dentro del proyecto y no importa desde donde importes.

Para configurarlo abre `vite.config.js` y agrega la seccion `resolve.alias`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

`path.resolve(__dirname, './src')` convierte `./src` en una ruta absoluta del sistema de archivos, que es lo que Vite necesita para resolver el alias correctamente.

Si tu proyecto usa TypeScript tambien debes agregar el alias en `tsconfig.json` para que el editor reconozca el path:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Proxy del servidor de desarrollo

Durante el desarrollo, el frontend corre en un puerto (por ejemplo `5173`) y el backend en otro (por ejemplo `8000`). Cuando el navegador hace una peticion a `http://localhost:8000/api/usuarios`, el backend puede rechazarla por politica CORS si no esta configurado para aceptar peticiones desde `http://localhost:5173`.

El proxy de Vite resuelve esto de forma transparente: en lugar de que el navegador llame directamente al backend, llama al servidor de desarrollo de Vite, y Vite reenvía la peticion al backend desde el servidor (no desde el navegador), evitando el problema de CORS por completo.

Agrega la seccion `server.proxy` en `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

Con esta configuracion, cualquier peticion que el frontend haga a `/api/...` sera redirigida automaticamente a `http://localhost:8000/api/...`.

## Uso con Axios

Sin el proxy, Axios necesita la URL completa del backend en cada llamada:

```js
const response = await axios.get('http://localhost:8000/api/usuarios');
```

Con el proxy activo, basta con usar el path relativo:

```js
const response = await axios.get('/api/usuarios');
```

Lo ideal es configurar la `baseURL` de Axios una sola vez en un archivo dedicado:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export default api;
```

Y luego en cualquier componente o servicio importas esa instancia:

```js
import api from '@/services/api';

const response = await api.get('/usuarios');
const created = await api.post('/usuarios', { nombre: 'Ana' });
```

El path final que viaja al backend es `/api/usuarios`. El proxy lo reenvía a `http://localhost:8000/api/usuarios`.

## vite.config.js completo

Este es el archivo con ambas configuraciones juntas:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

El proxy solo funciona durante el desarrollo con `npm run dev`. En produccion el frontend es un conjunto de archivos estaticos que se sirven desde Nginx (u otro servidor), y el enrutamiento de peticiones al backend se configura directamente en Nginx.
