# Componentes Básicos de Material-UI

[Material-UI](https://mui.com/)

Es una popular librería de componentes de React que implementa el sistema de diseño [Material Design](https://m3.material.io/) de Google. Provee una gran variedad de componentes listos para usar que te permiten construir interfaces de usuario atractivas y consistentes de forma rápida.

## Instalación

Para agregar Material-UI a tu proyecto React (Vite o Create React App), instala el paquete principal junto con sus dependencias de estilos:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

Si también necesitas los íconos de Material Design, instala el paquete adicional:

```bash
npm install @mui/icons-material
```

MUI usa la fuente **Roboto** por defecto. Puedes cargarla agregando este `<link>` en el `<head>` de tu `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
/>
```

Con eso ya puedes importar y usar cualquier componente de MUI directamente en tus archivos `.jsx`.

## Componentes Esenciales

A continuación, exploraremos algunos de los componentes más básicos y útiles.

## Stack

El componente `Stack` es un contenedor que te permite organizar elementos en una sola dimensión, ya sea vertical u horizontalmente. Es ideal para distribuir el espaciado entre elementos de forma consistente.

```jsx
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicStack() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
  );
}
```

## Typography (Label)

Para mostrar texto, Material-UI provee el componente `Typography`. Funciona como un reemplazo para las etiquetas HTML semánticas (`<h1>`, `<p>`, `<span>`, etc.) y permite aplicar estilos de texto consistentes.

```jsx
import Typography from '@mui/material/Typography';

export default function BasicTypography() {
  return (
    <Typography variant="h5" component="h2">
      Este es un título.
    </Typography>
  );
}
```

## TextField

El `TextField` es el componente para la entrada de datos por parte del usuario. Es altamente configurable y puedes capturar su valor a través del evento `onChange`.

```jsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function BasicTextField() {
  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <TextField 
        id="outlined-basic" 
        label="Nombre" 
        variant="outlined" 
        value={name}
        onChange={(e) => console.log(e.target.value)}
      />
      <Typography variant="body1" style={{ marginTop: '10px' }}>
        Hola, {name || 'desconocido'}!
      </Typography>
    </>
  );
}
```

## Button

El `Button` permite a los usuarios ejecutar una acción con un solo clic. Puedes manejar esta interacción con el evento `onClick`.

```jsx
import React from 'react';
import Button from '@mui/material/Button';

export default function BasicButton() {
  const handleClick = () => {
    alert('¡Botón presionado!');
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Haz Clic
    </Button>
  );
}
```

## Imagen

Para mostrar imágenes, puedes usar la etiqueta `<img>` estándar de HTML o componentes de Material-UI como `CardMedia` si estás dentro de un `Card`. Para un uso simple, un `div` con una imagen de fondo o una etiqueta `img` estilizada es suficiente.

```jsx
import React from 'react';

export default function BasicImage() {
  return (
    <img 
      src="https://via.placeholder.com/150" 
      alt="Placeholder" 
      style={{ width: '150px', height: '150px', borderRadius: '8px' }} 
    />
  );
}
```

## Ejemplo Completo

Ahora, combinemos todos estos elementos usando `Stack` para organizarlos verticalmente.

```jsx
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (email) {
      alert(`Iniciando sesión como ${email}`);
    } else {
      alert('Por favor, introduce tu email.');
    }
  };

  return (
    <Stack spacing={3} sx={{ width: 300, margin: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: '8px' }}>
      <img 
        src="https://mui.com/static/logo.png" 
        alt="MUI Logo" 
        style={{ width: '50px', height: '50px', margin: '0 auto' }} 
      />
      <Typography variant="h5" component="h1" textAlign="center">
        Inicio de Sesión
      </Typography>
      <TextField 
        id="email-input" 
        label="Email" 
        variant="outlined" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Entrar
      </Button>
    </Stack>
  );
}
```

## Template de main.jsx

Dado que es una libreria gráfica hay que lograr que el tema claro/oscuro se mantenga también con los componentes de material. Use este `main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

const theme = createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```
