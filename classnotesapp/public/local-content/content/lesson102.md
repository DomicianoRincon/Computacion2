# React Router

React Router es una librería esencial en el ecosistema de React que permite a las aplicaciones tener navegación entre distintas vistas o "páginas" sin necesidad de recargar el navegador. Esto es la base para construir una Aplicación de una Sola Página (SPA).

## Instalación

Primero, asegúrate de tener la librería en tu proyecto. Si no, instálala con npm:

```bash
npm install react-router-dom
```

## Las Páginas

Antes de definir rutas, es una buena práctica organizar los componentes que representan una pantalla completa en una carpeta dedicada, comúnmente llamada `src/pages/` o `src/screens/`.

```jsx
// src/pages/Home.jsx
export default function Home() {
  return <h1>Página de Inicio</h1>;
}

// src/pages/About.jsx
export default function About() {
  return <h1>Acerca de Nosotros</h1>;
}

// src/pages/NotFound.jsx
export default function NotFound() {
  return <h1>404 - Página no encontrada</h1>;
}
```

## Definiendo las Rutas con createBrowserRouter

React Router 6.4+ introduce una API programática más potente y flexible, especialmente para manejar carga de datos, acciones de formularios y errores. Se define un objeto `router` fuera del árbol de componentes y se pasa al `<RouterProvider>`.

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

Cada objeto del array define una ruta: `path` es la URL y `element` es el componente que se renderiza. La ruta `"*"` captura cualquier URL no definida y sirve como página 404.

## Navegación Programática con useNavigate

A veces necesitas redirigir al usuario después de una acción, como iniciar sesión. El hook `useNavigate` te permite hacerlo desde tu lógica.

```jsx
import { useNavigate } from "react-router-dom";

export function LoginComponent() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ...lógica de autenticación...

    // Redirige al usuario al home
    navigate("/home");
  };

  return <button onClick={handleLogin}>Iniciar Sesión</button>;
}
```

## Rutas con Parámetros Dinámicos (useParams)

Para crear páginas de detalle, como el perfil de un usuario, necesitas rutas dinámicas.

1. Define la ruta con un parámetro: El prefijo `:` indica que es un valor dinámico.

```jsx
{ path: "perfil/:userId", element: <Perfil /> }
```

2. Navega a esa ruta:

```javascript
navigate(`/perfil/24`); // Navega al perfil del usuario con ID 24
```

3. Recupera el parámetro en el componente con el hook `useParams`.

```jsx
import { useParams } from "react-router-dom";

function Perfil() {
  const { userId } = useParams(); // userId tendrá el valor "24"
  return <h1>Este es el perfil del usuario {userId}</h1>;
}
```

## Pasar Estado Durante la Navegación (useLocation)

Si necesitas pasar datos complejos (que no quieres en la URL) entre vistas, puedes usar el `state` de la navegación.

1. En el origen, pasa el estado al navegar:

```javascript
navigate("/welcome", { state: { userName: "Domiciano", token: "xyz123" } });
```

2. En el destino, recupera el estado con el hook `useLocation`.

```jsx
import { useLocation } from "react-router-dom";

function WelcomePage() {
  const location = useLocation();
  // Es buena práctica prever que el state pueda ser nulo
  const { userName, token } = location.state || {};

  return <h1>Bienvenido, {userName || "invitado"}!</h1>;
}
```
