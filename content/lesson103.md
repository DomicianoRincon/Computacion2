[t] Rutas Protegidas con ProtectedRoute
En aplicaciones reales, ciertas rutas solo deben ser accesibles para usuarios autenticados. El patrón `ProtectedRoute` es un componente que actúa como guardia: verifica si el usuario tiene un token válido en el `AuthContext` y, si no lo tiene, lo redirige automáticamente a la pantalla de login.

[st] El componente ProtectedRoute
`ProtectedRoute` lee el token del `AuthContext` definido en la lección anterior. Si el token existe, renderiza las rutas hijas mediante `<Outlet />`; si no existe, redirige a `/login`.
[code:jsx]
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
[endcode]
La prop `replace` evita que la redirección agregue una entrada al historial del navegador, impidiendo que el usuario quede atrapado al presionar "Atrás".

[st] La pantalla de Login
La pantalla de login usa `setToken` del contexto para guardar el token, y `useNavigate` para redirigir al dashboard una vez autenticado.
[code:jsx]
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Stack, TextField, Typography } from "@mui/material";

const LoginScreen = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    // En una app real, aquí se haría la petición al servidor
    const fakeToken = `token-${username}-${Date.now()}`;
    setToken(fakeToken);
    navigate("/");
  };

  return (
    <Stack alignItems="center" justifyContent="center" gap={2} sx={{ height: "100vh" }}>
      <Typography variant="h4">Iniciar Sesión</Typography>
      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button variant="contained" onClick={handleLogin} disabled={!username}>
        Entrar
      </Button>
    </Stack>
  );
};

export default LoginScreen;
[endcode]

[st] Configurando el enrutador con ProtectedRoute
`ProtectedRoute` se usa como elemento padre en `createBrowserRouter`. Todas las rutas que sean hijas suyas quedarán protegidas automáticamente.
[code:jsx]
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginScreen from "./screens/LoginScreen";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,   // Guardia de autenticación
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <DashboardPage /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
[endcode]
Cualquier ruta dentro de `children` de `ProtectedRoute` queda protegida. Agregar una ruta nueva al array no requiere ningún cambio adicional.

[st] Cerrando sesión
Para cerrar sesión, llama `setToken(null)` desde cualquier componente con acceso al contexto. El `AuthContext` limpia el `localStorage` automáticamente.
[code:jsx]
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return <Button onClick={handleLogout} color="error">Cerrar sesión</Button>;
};

export default LogoutButton;
[endcode]

[st] Flujo completo de autenticación
[list]
El usuario intenta acceder a `/` o cualquier ruta protegida.
`ProtectedRoute` consulta `token` en el `AuthContext`.
Si no hay token → redirige a `/login`.
El usuario ingresa sus datos y `LoginScreen` llama a `setToken`.
`AuthContext` sincroniza el token con `localStorage` automáticamente.
`ProtectedRoute` detecta el token y permite el acceso a las rutas hijas.
Al cerrar sesión, `setToken(null)` borra el token del contexto y del `localStorage`.
[endlist]
