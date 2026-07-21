# useContext

El hook `useContext` de React permite a los componentes acceder a un estado compartido sin necesidad de pasar props manualmente a través de múltiples niveles del árbol de componentes, un problema conocido como "prop drilling". Es ideal para datos globales como el token de autenticación del usuario.

## Creando el contexto de autenticación

El primer paso es crear el contexto y un provider que lo envuelva. En este ejemplo el contexto almacena el token de sesión del usuario.

```js
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

`AuthProvider` actúa como contenedor. Cualquier componente dentro de él puede acceder a `token` y `setToken` mediante el hook `useAuth`.

## Envolviendo la aplicación

Para que todos los componentes tengan acceso al contexto, envuelve la raíz de la aplicación con `AuthProvider` en `main.jsx`.

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
```

## Usando el contexto en un componente

Desde cualquier componente dentro del árbol, puedes leer y modificar el token con `useAuth`.

```jsx
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { token, setToken } = useAuth();

  return (
    <div>
      <p>{token ? `Sesión activa: ${token}` : "Sin sesión"}</p>
      <button onClick={() => setToken("nuevo-token-123")}>Simular login</button>
      <button onClick={() => setToken(null)}>Cerrar sesión</button>
    </div>
  );
};
```

## Persistir el token en localStorage

Para que la sesión sobreviva a un recargo de la página, sincronizamos el estado con `localStorage` usando `useEffect`.

```jsx
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Se ejecuta una sola vez al montar: recupera el token guardado
    return localStorage.getItem("token") || null;
  });

  useEffect(() => {
    // Cada vez que cambia el token, sincroniza con localStorage
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

Con esta versión, si el usuario recarga la página el token se recupera automáticamente de `localStorage` y la sesión se mantiene activa.
