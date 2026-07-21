# Renderizando Objetos y Listas en React

En esta lección, veremos cómo usar los hooks `useState` y `useEffect` para solicitar datos (un objeto y una lista de objetos) a una API y renderizarlos en nuestros componentes de React.

## Renderizando un Único Objeto

Para obtener y mostrar un único objeto, como un perfil de usuario, combinamos `useState` para almacenar los datos del perfil y `useEffect` para realizar la llamada a la API una sola vez, cuando el componente se monta.

## Componente de Perfil de Usuario

Este componente obtiene los datos de un perfil desde una API simulada y los muestra.

```jsx
import React, { useState, useEffect } from 'react';

// Componente para mostrar el perfil de un usuario
const UserProfile = () => {
  // 1. Estado para guardar los datos del perfil (inicialmente nulo)
  const [profile, setProfile] = useState(null);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // 2. useEffect para buscar los datos cuando el componente se monta
  useEffect(() => {
    // Definimos una función asíncrona dentro del efecto
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile'); // Endpoint de ejemplo
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue satisfactoria');
        }
        const data = await response.json();
        setProfile(data); // 3. Guardamos los datos en el estado
      } catch (err) {
        setError(err.message); // Guardamos el mensaje de error
      }
    };

    fetchProfile();
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // 4. Renderizado condicional
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }

  // 5. Renderizado del perfil una vez que los datos están disponibles
  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Email: ${profile.email}</p>
      <p>Usuario: ${profile.username}</p>
    </div>
  );
};

export default UserProfile;
```

## Renderizando una Lista de Objetos

El patrón es muy similar para una lista. Usamos `useState` para guardar un array de datos y `useEffect` para la llamada a la API. Luego, usamos el método `.map()` para transformar cada objeto del array en un elemento de React.

## Componente de Lista de Estudiantes

Este componente obtiene una lista de estudiantes y la renderiza.

```jsx
import React, { useState, useEffect } from 'react';

// Componente para mostrar una lista de estudiantes
const StudentList = () => {
  // 1. Estado para guardar la lista de estudiantes (inicialmente un array vacío)
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // 2. useEffect para buscar los datos cuando el componente se monta
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students'); // Endpoint de ejemplo
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue satisfactoria');
        }
        const data = await response.json();
        setStudents(data); // 3. Guardamos la lista en el estado
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudents();
  }, []); // Se ejecuta solo una vez

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (students.length === 0) {
    return <div>Cargando estudiantes...</div>;
  }

  // 4. Renderizado de la lista usando .map()
  return (
    <div>
      <h2>Lista de Estudiantes</h2>
      <ul>
        {students.map(student => (
          // Usamos el 'code' como 'key' porque debe ser único
          <li key={student.code}>
            <strong>{student.name}</strong> ({student.program}) - Código: ${student.code}
          </li>
        ))}
      </ul>
    </div>
  );
};  
export default StudentList;
```

`Punto Clave`
Al renderizar una lista con `.map()`, es fundamental proporcionar una prop `key` única a cada elemento raíz de la lista (en este caso, el `<li>`). React usa esta `key` para identificar qué elementos han cambiado, se han agregado o eliminado, optimizando así el rendimiento.
