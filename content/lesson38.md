# Local Storage

Cuando un usuario inicia sesión en una aplicación, el servidor generalmente devuelve un `accessToken` (token de acceso). Este token es una credencial que permite al usuario acceder a rutas protegidas de una API. Para que el usuario no tenga que iniciar sesión cada vez que recarga la página, necesitamos almacenar este token de forma persistente en el navegador. Una de las formas más comunes de hacerlo es usando `localStorage`.

## ¿Qué es Local Storage?

`localStorage` es una API del navegador que permite a las aplicaciones web almacenar datos de tipo clave-valor de forma persistente, sin fecha de expiración. Los datos almacenados en `localStorage` persisten incluso después de que el navegador se cierra y se vuelve a abrir.

## Guardando el Token en `localStorage`

Para guardar el token, usamos el método `setItem()`. Este método recibe dos argumentos: una clave (key) y un valor (value), ambos deben ser strings.

## Flujo típico después del login

1.  El usuario envía sus credenciales (email/contraseña) al servidor.
2.  El servidor valida las credenciales y devuelve un `accessToken`.
3.  La aplicación cliente (React) recibe el token y lo guarda en `localStorage`.

```jsx
// Suponiendo que 'apiLogin' es una función que hace la petición a tu API
const handleLogin = async (email, password) => {
  try {
    const response = await apiLogin(email, password);
    
    // Asumimos que la respuesta tiene una propiedad 'accessToken'
    const { accessToken } = response.data;

    if (accessToken) {
      // Guardamos el token en localStorage
      localStorage.setItem('accessToken', accessToken);
      console.log('Token guardado exitosamente!');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  }
}
```

## Leyendo el Token desde `localStorage`

Para recuperar el token y usarlo en futuras peticiones a la API, usamos el método `getItem()`. Este método recibe la clave del ítem que queremos obtener.

```jsx
...
const token = localStorage.getItem('accessToken');

fetch('https://api.example.com/profesores', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
...
```

## Eliminando el Token de `localStorage`

Cuando el usuario cierra sesión (`logout`), es crucial eliminar el token de `localStorage` para invalidar su sesión en el cliente. Para esto, usamos el método `removeItem()`.

```jsx
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  console.log('Token eliminado. Sesión cerrada.');
}
```

También puedes usar `localStorage.clear()` para eliminar todos los datos almacenados en `localStorage` para ese dominio, pero `removeItem()` es más preciso.

## Consideraciones de Seguridad

Aunque `localStorage` es muy conveniente, es importante ser consciente de sus implicaciones de seguridad:
*   Vulnerabilidad a XSS: Los datos en `localStorage` son accesibles a través de JavaScript. Si tu aplicación tiene una vulnerabilidad de Cross-Site Scripting (XSS), un atacante podría ejecutar código malicioso para robar el token del usuario.
*   No almacenes datos sensibles: Nunca guardes información altamente sensible como contraseñas o datos personales sin cifrar en `localStorage`.

Para muchas aplicaciones, almacenar el `accessToken` en `localStorage` es una solución aceptable, pero para aplicaciones que requieren alta seguridad, se suelen explorar otras alternativas como `HttpOnly cookies`. Sin embargo, para empezar, `localStorage` es una herramienta muy útil y fácil de implementar.
