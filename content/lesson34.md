[t] Componentes y JSX
[icon] https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark-3000x1007.png | React

React es una librería de JavaScript desarrollada por Meta para construir interfaces de usuario de manera declarativa y eficiente. Permite crear componentes reutilizables que gestionan su propio estado, facilitando la construcción de interfaces dinámicas. React utiliza un `Virtual DOM` para minimizar las manipulaciones reales del DOM, mejorando el rendimiento.

[st] Crear el proyecto con Vite

[code:sh]
npm create vite@latest nombre-de-tu-app -- --template react
cd nombre-de-tu-app
npm install
npm run dev
[endcode]

[st] Estructura del proyecto

[code:sh]
nombre-de-tu-app/
├── public/          # Archivos estáticos
├── src/
│   ├── App.jsx      # Componente raíz
│   ├── main.jsx     # Punto de entrada
│   └── index.css    # Estilos globales
├── index.html
└── package.json
[endcode]

Los archivos que más vamos a editar son los que están dentro de `src/`. En particular, `App.jsx` es donde empieza todo.

[st] Primer vistazo a main.jsx

[code:jsx]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
[endcode]

Este archivo conecta React con el HTML. Le dice a React que tome el elemento con `id="root"` del `index.html` y lo controle desde ahí. Todo lo que construimos vive dentro de `<App />`.

[st] ¿Qué es un componente?

Un componente es una función de JavaScript que retorna lo que se va a mostrar en pantalla. Es la unidad básica de React: todo en una aplicación React es un componente.

[code:jsx]
function Saludo() {
  return <h1>Hola desde React</h1>
}
[endcode]

Para usarlo en otro componente, escríbelo como si fuera una etiqueta HTML:

[code:jsx]
function App() {
  return (
    <div>
      <Saludo />
      <Saludo />
    </div>
  )
}
[endcode]

Cada vez que escribes `<Saludo />`, React ejecuta esa función y muestra su resultado.

[st] JSX

JSX es la sintaxis que parece HTML pero está dentro de JavaScript. React la convierte al código que el navegador entiende.

[code:jsx]
function Tarjeta() {
  return (
    <div>
      <h2>Sensor A</h2>
      <p>Temperatura</p>
    </div>
  )
}
[endcode]

[st] Reglas importantes de JSX

Solo puede haber un elemento raíz por componente. Si necesitas retornar varios elementos sin agregar un `div` extra, usa un fragmento vacío `<>...</>`.

Las clases CSS se escriben como `className`, no como `class`.

Las expresiones de JavaScript van entre llaves `{}`.

Las etiquetas siempre deben cerrarse, incluso las que en HTML no lo hacen (`<input />`, `<img />`).

[code:jsx]
function Tarjeta({ nombre }) {
  return (
    <>
      <h2 className="titulo">{nombre}</h2>
      <input type="text" />
    </>
  )
}
[endcode]

[st] Material UI

Para agilizar la construcción visual de las páginas usamos Material UI:

[code:sh]
npm install @mui/material @emotion/react @emotion/styled
[endcode]

[code:sh]
npm install @mui/icons-material
[endcode]

[st] Diccionario de eventos de React

Aquí los eventos más comunes que puedes usar en componentes React, con ejemplos simples.

[st] Eventos de Mouse

`onClick` — Se dispara cuando se hace clic en un elemento.
[code:jsx]
<button onClick={() => alert('¡Hiciste clic!')}>Click aquí</button>
[endcode]

`onDoubleClick` — Se ejecuta cuando se hace doble clic sobre un elemento.
[code:jsx]
<div onDoubleClick={() => alert('Doble clic')}>Haz doble clic</div>
[endcode]

`onMouseEnter` — Se activa cuando el cursor entra al área del elemento.
[code:jsx]
<div onMouseEnter={() => console.log('Entraste al área')}>Pasa el mouse</div>
[endcode]

`onMouseLeave` — Se activa cuando el cursor sale del área del elemento.
[code:jsx]
<div onMouseLeave={() => console.log('Saliste del área')}>Pasa el mouse</div>
[endcode]

`onMouseMove` — Detecta el movimiento del cursor sobre un elemento.
[code:jsx]
<div onMouseMove={(e) => console.log(`X: ${e.clientX}, Y: ${e.clientY}`)}>Mueve el mouse</div>
[endcode]

`onMouseDown` — Se activa al presionar el botón del mouse.
[code:jsx]
<div onMouseDown={() => console.log('Mouse presionado')}>Presiona mouse</div>
[endcode]

`onMouseUp` — Se ejecuta al soltar el botón del mouse.
[code:jsx]
<div onMouseUp={() => console.log('Mouse soltado')}>Suelta el mouse</div>
[endcode]

`onContextMenu` — Se ejecuta al hacer clic derecho.
[code:jsx]
<div onContextMenu={(e) => { e.preventDefault(); alert('Menú contextual bloqueado'); }}>
  Clic derecho aquí
</div>
[endcode]

[st] Eventos de Teclado

`onKeyDown` — Detecta cuando una tecla es presionada.
[code:jsx]
<input onKeyDown={(e) => console.log(`Tecla abajo: ${e.key}`)} />
[endcode]

`onKeyUp` — Se activa al soltar una tecla.
[code:jsx]
<input onKeyUp={(e) => console.log(`Tecla arriba: ${e.key}`)} />
[endcode]

[st] Eventos de Formulario

`onChange` — Se dispara cuando cambia el valor de un input o select.
[code:jsx]
<input onChange={(e) => console.log(e.target.value)} />
[endcode]

`onSubmit` — Se activa al enviar un formulario.
[code:jsx]
<form onSubmit={(e) => { e.preventDefault(); alert('Formulario enviado'); }}>
  <button type="submit">Enviar</button>
</form>
[endcode]

`onFocus` — Se activa cuando un elemento recibe el foco.
[code:jsx]
<input onFocus={() => console.log('Enfocado')} />
[endcode]

`onBlur` — Se dispara cuando un elemento pierde el foco.
[code:jsx]
<input onBlur={() => console.log('Desenfocado')} />
[endcode]

`onReset` — Se ejecuta al reiniciar un formulario.
[code:jsx]
<form onReset={() => console.log('Formulario reiniciado')}>
  <button type="reset">Reset</button>
</form>
[endcode]

`onSelect` — Se activa cuando el usuario selecciona texto.
[code:jsx]
<input onSelect={() => console.log('Texto seleccionado')} />
[endcode]

`onInvalid` — Se activa cuando un input inválido intenta enviarse.
[code:jsx]
<form onSubmit={(e) => e.preventDefault()}>
  <input required onInvalid={() => alert('Campo requerido')} />
  <button type="submit">Enviar</button>
</form>
[endcode]

[st] Eventos de Scroll

`onScroll` — Se dispara cuando el usuario hace scroll.
[code:jsx]
<div onScroll={() => console.log('Scroll detectado')} style={{ height: 100, overflow: 'auto' }}>
  <div style={{ height: 300 }}>Contenido largo</div>
</div>
[endcode]

[st] Eventos Misceláneos

`onError` — Se ejecuta cuando ocurre un error de carga, por ejemplo en imágenes.
[code:jsx]
<img src="imagen-inexistente.jpg" onError={() => alert('Error al cargar imagen')} />
[endcode]

`onLoad` — Se activa cuando el recurso se carga completamente.
[code:jsx]
<img src="https://via.placeholder.com/150" onLoad={() => console.log('Imagen cargada')} />
[endcode]
