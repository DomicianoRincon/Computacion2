# Deploy

Ejecuta el siguiente comando en la raíz del proyecto:

```sh
npm run build
```

Esto generará una carpeta dist/ con los archivos estáticos listos para producción.

Luego, abra el archivo `vite.config.js` y agrega (o modifica) la propiedad base con el nombre del path base que usarás en Tomcat. En este ejemplo, lo llamaremos `misuperapp`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/misuperapp/'
});
```

Luego necesita poner la ruta en el BrowserRouter

```js
const router = createBrowserRouter([...],{
    basename: "/misuperapp",
});
```

Guarde los cambios y vuelve a ejecutar

```sh
npm run build
```

Luego, vaya al directorio `webapps` de Tomcat y crea una carpeta llamada `misuperapp` o como le haya puesto a su path `base`. Esta carpeta determina la ruta de acceso en el servidor. Por ejemplo si la carpeta se llama `misuperapp`, la URL queda:

http://localhost:8080/misuperapp

Tiene que concordar con su ruta `base`

> Puede usar el nombre de su equipo como base

Luego, copie el contenido de dist/ dentro de la carpeta recién creada

La estructura de archivos quedará como

```plain
$TOMCAT/
└── webapps/
    └── misuperapp/
        ├── assets/
        │   ├── index-sd89231.js
        │   └── style-8d1acb1.css
        ├── index.html
        ├── favicon.svg (o favicon.ico, si lo usas)
        └── WEB-INF/
            └── web.xml
```

Cree la carpeta WEB-INF dentro de `misuperapp`, y dentro de ella un archivo llamado web.xml:

Cree el archivo `web.xml` con el siguiente contenido:

```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         version="3.1">
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>
</web-app>
```

Este paso es fundamental para que React Router funcione correctamente incluso cuando el usuario recarga rutas internas.

La estructura final debe quedar así

```plain
$TOMCAT/
└── webapps/
    └── misuperapp/
        ├── assets/
        │   ├── index-sd89231.js
        │   └── style-8d1acb1.css
        ├── index.html
        ├── favicon.svg (o favicon.ico, si lo usas)
        └── WEB-INF/
            └── web.xml
```

Abra el navegador con la URL

http://localhost:8080/misuperapp

Tu aplicación React debería cargarse sin problemas. Puedes probar también rutas internas para asegurarte de que el web.xml está funcionando correctamente.
