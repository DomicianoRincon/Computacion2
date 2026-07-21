# Axios

Axios es una librería de JavaScript que funciona como un cliente HTTP. Su principal ventaja es que está basada en promesas, lo que simplifica enormemente la tarea de realizar peticiones a un servidor (API) y manejar las respuestas de forma asíncrona. Funciona tanto en el navegador como en Node.js.

## Instalación

```sh
npm install axios
```

## Petición GET con Axios

Una petición `GET` se utiliza para solicitar datos de un recurso específico. Con Axios, el método `.get()` devuelve una promesa que se resuelve con el objeto de respuesta.

```js
import axios from 'axios';

// Definir una función flecha asíncrona
const fetchUsers = async () => {
  try {
    // Esperar la respuesta de la petición
    const response = await axios.get('https://api.example.com/users');
    
    // La petición fue exitosa
    console.log('Usuarios:', response.data);
  } catch (error) {
    // Si ocurre un error, se maneja aquí
    console.error('Error al obtener los usuarios:', error);
  }
};

// Llamar a la función
fetchUsers();
```

## Petición POST con Axios

Una petición `POST` se usa para enviar datos a un servidor para crear un nuevo recurso. El método `.post()` toma dos argumentos principales: la URL y el objeto de datos que se enviará en el cuerpo de la petición.

```js
import axios from 'axios';

// Objeto del nuevo usuario
const newUser = {
  name: 'Juan Pérez',
  email: 'juan.perez@example.com'
};

// Función flecha asíncrona
const createUser = async () => {
  try {
    // Esperar la respuesta del servidor
    const response = await axios.post('https://api.example.com/users', newUser);

    // Si la petición fue exitosa
    console.log('Usuario creado:', response.data);
  } catch (error) {
    // Si ocurre un error
    console.error('Error en la creación:', error);
  }
};

// Llamar a la función
createUser();
```

## Interceptores

Los interceptores son funciones que Axios ejecuta antes de que una petición sea enviada o después de que una respuesta sea recibida. Son extremadamente útiles para tareas repetitivas, como añadir un token de autenticación a cada petición.

El siguiente ejemplo muestra cómo usar un interceptor de petición (`request`) para buscar un `accessToken` en el `localStorage` y añadirlo a la cabecera `Authorization` en cada llamada.

```js
import axios from 'axios';

// 1. Crear una instancia de Axios. Es una buena práctica para no afectar
// la configuración global si se usan otras instancias.
const apiClient = axios.create({
  baseURL: 'https://api.example.com'
});

// 2. Configurar el interceptor de petición
apiClient.interceptors.request.use(
  config => {
    // Buscar el token en el localStorage antes de que la petición se envíe
    const accessToken = localStorage.getItem('accessToken');

    // Si el token existe, se añade a la cabecera de autorización
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // El interceptor debe devolver siempre la configuración de la petición
    return config;
  },
  error => {
    // Manejar un posible error en la configuración de la petición
    return Promise.reject(error);
  }
);

// 3. Ahora, cualquier petición hecha con `apiClient` ejecutará el interceptor
// y añadirá el token automáticamente.
export default apiClient;

```
