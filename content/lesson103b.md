[t] Rutas Anidadas y Layouts con Outlet
En aplicaciones complejas, es común tener interfaces donde una parte de la página es estática (como una barra lateral de navegación) y solo una sección del contenido cambia. React Router maneja esto de forma elegante a través de las rutas anidadas y el componente `<Outlet>`.

[st] ¿Qué es un Outlet?
Un `<Outlet>` es un componente de `react-router-dom` que actúa como marcador de posición. El componente de la ruta padre (el "layout") decide dónde se renderizan las rutas hijas. Ese lugar es exactamente donde colocas `<Outlet />`.

[st] Configurando Rutas Anidadas
Las rutas hijas se definen con la propiedad `children` dentro del objeto de la ruta padre en `createBrowserRouter`.
[code:jsx]
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import { Home, Students, Settings } from "./components/DashboardComponents";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,     // Componente Layout
    children: [
      {
        index: true,             // Ruta por defecto para /
        element: <Home />,
      },
      {
        path: "students",        // Se resuelve como /students
        element: <Students />,
      },
      {
        path: "settings",        // Se resuelve como /settings
        element: <Settings />,
      },
    ],
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
[endcode]

[st] Analizando la configuración
[list]
Ruta padre (`/`): React Router renderiza `<HomeScreen />` cuando el usuario navega a cualquier ruta bajo `/`.
Propiedad `children`: Define las rutas accesibles dentro del layout.
Ruta índice (`index: true`): `<Home />` se renderiza en el `<Outlet />` cuando la URL es exactamente `/`.
Ruta hija (`path: "students"`): `<Students />` se renderiza cuando la URL es `/students`. React Router concatena la ruta del padre con la hija automáticamente.
[endlist]

[st] El componente Layout con Outlet
`HomeScreen` actúa como layout persistente. La clave es incluir `<Outlet />` donde deben aparecer las rutas hijas.
[code:jsx]
import { Outlet, Link } from "react-router-dom";
import { Box, Stack, Button } from "@mui/material";

const HomeScreen = () => {
  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
      <Stack sx={{ width: 300, bgcolor: "#f4f4f4", p: 2 }}>
        <Button component={Link} to="">Inicio</Button>
        <Button component={Link} to="students">Estudiantes</Button>
        <Button component={Link} to="settings">Configuración</Button>
      </Stack>
      <Box sx={{ flexGrow: 1, bgcolor: "background.paper", p: 3 }}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default HomeScreen;
[endcode]
Al usar `<Link>`, React Router intercepta la navegación y actualiza el contenido sin recargar la página.

[st] Creando los componentes de las rutas hijas
Los componentes de las rutas hijas son componentes normales de React que se renderizan dentro del `<Outlet />` del layout.
[code:jsx]
import { Typography } from "@mui/material";

export const Home = () => {
  return <Typography variant="h4">Bienvenido al Dashboard</Typography>;
};

export const Students = () => {
  return <Typography variant="h4">Lista de Estudiantes</Typography>;
};

export const Settings = () => {
  return <Typography variant="h4">Configuración</Typography>;
};
[endcode]

[st] Modificaciones a index.css y App.css
Para que el layout ocupe toda la pantalla, ajusta los archivos CSS.
[code:css]
/* En App.css */
.root {
  height: 100vh;
  width: 100vw;
}
[endcode]
[code:css]
/* En index.css */
html, body, #root {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
[endcode]
Estos cambios aseguran que `#root` y sus ancestros ocupen el 100% de la ventana, permitiendo que el layout se expanda correctamente.

[st] Combinando ProtectedRoute con Outlet
Las dos lecciones anteriores se pueden combinar: `ProtectedRoute` actúa como primera capa de seguridad y `HomeScreen` provee el layout con `<Outlet />`.
[code:jsx]
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,      // Capa 1: seguridad
    children: [
      {
        element: <HomeScreen />,      // Capa 2: layout con Outlet
        children: [
          { index: true, element: <Home /> },
          { path: "students", element: <Students /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);
[endcode]

[st] Resumen
[list]
Rutas anidadas: Permiten construir layouts donde una parte de la UI es persistente y solo el contenido cambia.
`<Outlet>`: Marcador de posición donde se renderizan los componentes de las rutas hijas.
`children` en el router: Define la jerarquía de rutas anidadas dentro de `createBrowserRouter`.
`<Link>`: Navegación interna sin recargar la página.
CSS: Ajustar `html`, `body` y `#root` garantiza que el layout ocupe el 100% de la pantalla.
[endlist]
