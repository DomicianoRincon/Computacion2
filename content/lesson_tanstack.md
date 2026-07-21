# Introduccion a TanStack Query

TanStack Query (antes conocido como React Query) es una libreria para manejar el estado del servidor en aplicaciones React. Su propuesta es sencilla: en lugar de usar `useState` + `useEffect` para hacer fetch de datos, usas hooks declarativos que se encargan automaticamente de la carga, el error, el cache y la sincronizacion.

## El problema que resuelve

Sin TanStack Query, el patron tipico para obtener datos de una API se ve asi:

```js
const [usuarios, setUsuarios] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  api.get('/usuarios')
    .then(res => setUsuarios(res.data))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);
```

Este bloque se repite en cada componente que necesite datos. TanStack Query lo reemplaza con un solo hook y ademas agrega cache, reintentos automaticos y sincronizacion entre componentes.

## Instalacion

```sh
npm install @tanstack/react-query
```

## Configuracion inicial

Envuelve tu aplicacion con `QueryClientProvider` en el archivo principal (`main.jsx`):

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

`QueryClient` es el objeto que gestiona el cache global de la aplicacion. Solo se crea una vez.

## useQuery: leer datos

`useQuery` sirve para hacer peticiones GET. Recibe una `queryKey` (identificador unico del cache) y una funcion que retorna la promesa con los datos:

```jsx
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

function ListaUsuarios() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => api.get('/usuarios').then(res => res.data),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  return (
    <ul>
      {data.map(u => <li key={u.id}>{u.nombre}</li>)}
    </ul>
  );
}
```

La `queryKey` es el identificador del cache. Si dos componentes usan la misma key, comparten los datos sin hacer dos peticiones.

## useMutation: crear, editar o eliminar

`useMutation` sirve para peticiones que modifican datos (POST, PUT, DELETE). Despues de una mutacion exitosa se puede invalidar la query correspondiente para que los datos se actualicen automaticamente:

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

function CrearUsuario() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (nuevoUsuario) => api.post('/usuarios', nuevoUsuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const handleSubmit = () => {
    mutate({ nombre: 'Ana', email: 'ana@mail.com' });
  };

  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? 'Guardando...' : 'Crear usuario'}
    </button>
  );
}
```

`invalidateQueries` marca el cache de `['usuarios']` como desactualizado, y TanStack Query vuelve a hacer el fetch automaticamente en el componente que usa esa query.

## Estados disponibles

Los hooks exponen varios booleanos para manejar la UI segun el estado de la peticion:

- `isLoading` — true la primera vez que se carga, cuando no hay datos en cache.
- `isFetching` — true cada vez que hay una peticion en curso (incluyendo refetches).
- `isError` — true si la peticion fallo.
- `isSuccess` — true si los datos se obtuvieron correctamente.
- `isPending` — en mutaciones, true mientras la peticion esta en vuelo.
