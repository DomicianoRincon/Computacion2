# useRef

En React, la forma más común de manejar formularios es a través de "componentes controlados", usando el hook `useState` para gestionar el valor de cada campo. Sin embargo, cuando un formulario tiene muchos campos, este enfoque puede causar problemas de rendimiento, ya que el componente se vuelve a renderizar con cada tecla que el usuario presiona.

Una mejor práctica para formularios grandes o complejos es usar "componentes no controlados" con el hook `useRef`. Con `useRef`, accedemos al valor del campo directamente desde el DOM solo cuando es necesario (por ejemplo, al enviar el formulario), evitando renderizados innecesarios.

## Ejemplo

Este ejemplo muestra un formulario de perfil de usuario. Los valores no se guardan en un estado, sino que se leen directamente del DOM al momento del envío.

```js
import React, { useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";

function ProfileForm() {
  // 1. Crear referencias para los campos
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const bioRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    // 2. Acceder a los valores desde las refs
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      bio: bioRef.current.value,
    };

    console.log("Datos del formulario:", formData);
    alert("Formulario enviado. Revisa la consola.");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Editar Perfil
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Campo Nombre */}
          <TextField
            label="Nombre"
            inputRef={nameRef}
            defaultValue="Juan"
            variant="outlined"
            fullWidth
          />

          {/* Campo Email */}
          <TextField
            label="Email"
            type="email"
            inputRef={emailRef}
            defaultValue="juan@example.com"
            variant="outlined"
            fullWidth
          />

          {/* Campo Biografía */}
          <TextField
            label="Biografía"
            inputRef={bioRef}
            defaultValue="Desarrollador de software."
            variant="outlined"
            multiline
            rows={3}
            fullWidth
          />

          {/* Botón */}
          <Button type="submit" variant="contained" color="primary">
            Guardar Perfil
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProfileForm;
```

## Ventajas de `useRef` en Formularios

1.  Rendimiento: Es la principal ventaja. El componente solo se renderiza una vez (la inicial). No hay más renderizados al escribir en los campos, lo que hace la UI mucho más fluida en formularios con decenas o cientos de campos.

2.  Acceso Directo al DOM: `useRef` te da una "puerta de escape" para interactuar directamente con los nodos del DOM, lo cual es ideal para leer valores de forma imperativa como en este caso.

3.  Código Más Sencillo (en este contexto): No necesitas una función `handler` para cada campo (`handleNameChange`, `handleEmailChange`, etc.). Solo necesitas una función para el evento `onSubmit`.

¿Cuándo usar este enfoque?

Es ideal para formularios donde no necesitas reaccionar a los cambios en tiempo real (como validación instantánea o campos que dependen de otros). Si solo necesitas recopilar los datos al final, `useRef` es una práctica recomendada y muy eficiente.
