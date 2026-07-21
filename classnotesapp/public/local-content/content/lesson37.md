# useEffect

`useEffect` te deja hacer cosas después de que React renderiza el componente.
Por ejemplo, se usa para

- Llamar una API.
- Escuchar o limpiar eventos.
- Actualizar el título de la página.

`useEffect` es básicamente “Hacé algo cuando mi componente se monte, cambie o se desmonte.”

## Anatomía de `useEffect`

`useEffect` es una función que recibe dos argumentos
1.  Una función de efecto que se ejecutará después de que el componente se renderice.
2.  Un array de dependencias (opcional) que controla cuándo se debe volver a ejecutar el efecto.

```jsx
import React, { useEffect } from 'react';

useEffect(() => {
  // Tu código de efecto aquí
  console.log('El componente se ha renderizado o actualizado.');

  return () => {
    // Función de limpieza (opcional)
    console.log('El componente se va a desmontar o el efecto se va a re-ejecutar.');
  };
}, [/* array de dependencias */]);
```

## `useEffect` con `[]` (Array Vacío)

Cuando el array de dependencias está vacío, el efecto se ejecuta una sola vez, justo después del primer renderizado del componente.

Caso de uso típico
Realizar una petición a una API para cargar datos iniciales.

```jsx
import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  console.log('1. Renderizando del componente');

  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('3. Efecto ejecutado: Buscando datos del usuario...');

    const fetchUser = async () => {
      const fetchedUser = await getUserById(56);
      console.log('4. Datos recibidos y estado actualizado.');
      setUser(fetchedUser);
    };

    fetchUser();

    return () => {
      console.log('6. Limpieza: El componente UserProfile se está desmontando.');
    };
  }, []); // Se ejecuta una sola vez al montar

  console.log('2. Renderizando componente user nulo');
  if (!user) {
    return <div>Cargando...</div>;
  }

  console.log('5. Renderizando componente (con datos del usuario)');
  return <div>Nombre: {user.name}</div>;
};

export default UserProfile;
```

`Flujo`
`1` Renderizando del componente
`2` Renderizando componente user nulo
`3` Efecto ejecutado: Buscando datos del usuario...
`4` Datos recibidos y estado actualizado.
`5` Renderizando componente (con datos del usuario)
`6` Limpieza: El componente UserProfile se está desmontando.

## `useEffect` con Dependencias `[variable]`

Cuando incluyes una o más variables en el array de dependencias, el efecto se ejecutará después del primer renderizado y cada vez que alguna de esas variables cambie de valor.

`Flujo`
`1` El componente se monta y se renderiza.
`2` React ejecuta la función de efecto.
`3` El usuario realiza una acción que cambia el valor de una variable en el array de dependencias.
`4` El componente se re-renderiza con el nuevo valor.
`5` Antes de ejecutar el efecto de nuevo, React ejecuta la función de limpieza del efecto anterior.
`6` Después del re-renderizado, React ejecuta la función de efecto nuevamente porque una dependencia cambió.

Caso de uso típico
Buscar datos que dependen de un ID que puede cambiar, o suscribirse a un evento que depende de una prop.

```jsx
import React, { useState, useEffect } from 'react';

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    console.log(`Efecto ejecutado para productId: ${productId}`);

    // Definimos una función flecha asíncrona dentro del efecto
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://api.example.com/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProduct();

    // Limpieza: se ejecuta antes de que corra el siguiente efecto o al desmontar
    return () => {
      console.log(`Limpiando efecto anterior para productId: ${productId}`);
    };
  }, [productId]); // <-- El efecto depende de productId

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  return <h2>{product.name}</h2>;
};

export default ProductDetails;
```

Si `productId` cambia de `1` a `2`, el flujo sería:
1.  Se ejecuta la función de limpieza con el valor "viejo" (`productId` era `1`).
2.  El componente se re-renderiza.
3.  Se ejecuta la función de efecto con el valor "nuevo" (`productId` es `2`).

## El Retorno de `useEffect`: La Función de Limpieza

La función que se retorna desde `useEffect` se llama función de limpieza (`cleanup function`). Su propósito es "limpiar" lo que el efecto hizo antes de que el componente se desmonte o antes de que el efecto se vuelva a ejecutar.

¿Por qué es importante?
Para prevenir "fugas de memoria" (memory leaks) y comportamiento inesperado. Por ejemplo cancelar llamadas a API

```jsx
import React, { useState, useEffect } from 'react';

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    console.log(`Efecto ejecutado para productId: ${productId}`);

    // Creamos un controlador para abortar el fetch
    const controller = new AbortController();
    const signal = controller.signal;

    // Hacemos la petición con async/await
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://api.example.com/products/${productId}`,
          { signal } // Pasamos la señal al fetch
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(`Petición cancelada para productId: ${productId}`);
        } else {
          console.error('Error al obtener el producto:', error);
        }
      }
    };

    fetchProduct();

    // Función de limpieza: cancela el fetch si el efecto se reinicia o el componente se desmonta
    return () => {
      console.log(`Limpiando efecto anterior para productId: ${productId}`);
      controller.abort(); // Cancela la solicitud en curso
    };
  }, [productId]);

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  return <h2>{product.name}</h2>;
};

export default ProductDetails;
```
