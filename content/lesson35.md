[t] Estado con useState

En React, el "estado" (state) es un valor que pertenece a un componente y puede cambiar con el tiempo. Cuando el estado cambia, React re-renderiza automáticamente el componente para reflejar esos cambios en la interfaz.

[st] Por qué no funcionan las variables normales

[code:jsx]
function Contador() {
  let contador = 0

  function incrementar() {
    contador = contador + 1
    // React no sabe que el valor cambió, no actualiza la pantalla
  }

  return <button onClick={incrementar}>{contador}</button>
}
[endcode]

El problema es que React solo actualiza la pantalla cuando detecta un cambio en el **estado**. Una variable normal no dispara esa detección.

[st] Introducción al Hook useState

El Hook `useState` nos permite añadir estado a los componentes funcionales. Es la forma más común y fundamental de gestionar el estado local.

`useState` devuelve un arreglo con dos elementos:

[list]
El valor actual del estado
Una función para actualizar ese valor
[endlist]

[code:jsx]
import { useState } from 'react'

function Contador() {
  const [contador, setContador] = useState(0)

  function incrementar() {
    setContador(contador + 1)
  }

  return <button onClick={incrementar}>{contador}</button>
}
[endcode]

Anatomía de `useState`:

[code:jsx]
const [valor, setValor] = useState(valorInicial)
//     |       |                   |
//     |       |                   Valor con el que empieza
//     |       Función para cambiar el valor
//     El valor actual
[endcode]

[st] Actualizando el Estado

Para actualizar el estado, siempre debes usar la función `set` que `useState` proporciona. Nunca modifiques el estado directamente: React no detectará el cambio y el componente no se re-renderizará.

Cuando llamas a `setContador`, React actualiza el valor y re-renderiza el componente automáticamente.

[st] Inmutabilidad del Estado

Es una práctica fundamental tratar el estado como inmutable. Para objetos y arreglos, siempre crea una nueva copia con los cambios deseados y usa la función `set` para actualizar.

[st] Estado con Strings

[code:jsx]
import { useState } from 'react'

function Saludo() {
  const [nombre, setNombre] = useState('Mundo')

  return (
    <div>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <p>Hola, {nombre}!</p>
    </div>
  )
}
[endcode]

El estado `nombre` siempre refleja lo que el usuario escribe, y el input siempre muestra el estado actual. Este patrón se llama **componente controlado**.

[st] Estado con Booleans

[code:jsx]
import { useState } from 'react'

function Toggle() {
  const [estaEncendido, setEstaEncendido] = useState(false)

  return (
    <div>
      <button onClick={() => setEstaEncendido(!estaEncendido)}>
        {estaEncendido ? 'Apagar' : 'Encender'}
      </button>
      <p>{estaEncendido ? 'La luz está encendida' : 'La luz está apagada'}</p>
    </div>
  )
}
[endcode]

[st] Estado con Objetos

Cuando actualizas un objeto en el estado, copia las propiedades existentes con el spread operator y solo modifica las que necesites.

[code:jsx]
import { useState } from 'react'

function UsuarioPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: 'Juan',
    apellido: 'Pérez',
    edad: 30
  })

  const actualizarEdad = () => {
    setUsuario({ ...usuario, edad: usuario.edad + 1 })
  }

  return (
    <div>
      <p>Nombre: {usuario.nombre}</p>
      <p>Apellido: {usuario.apellido}</p>
      <p>Edad: {usuario.edad}</p>
      <button onClick={actualizarEdad}>Cumplir años</button>
    </div>
  )
}
[endcode]

[st] Estado con Arrays

Similar a los objetos: cuando actualizas un arreglo, crea una nueva copia.

[code:jsx]
import { useState } from 'react'

function ListaTareas() {
  const [tareas, setTareas] = useState(['Aprender React', 'Construir una app'])
  const [nuevaTarea, setNuevaTarea] = useState('')

  const agregarTarea = () => {
    if (nuevaTarea.trim() !== '') {
      setTareas([...tareas, nuevaTarea])
      setNuevaTarea('')
    }
  }

  return (
    <div>
      <input
        type="text"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button onClick={agregarTarea}>Agregar</button>
      <ul>
        {tareas.map((tarea, index) => (
          <li key={index}>{tarea}</li>
        ))}
      </ul>
    </div>
  )
}
[endcode]

[st] Actualizaciones Funcionales

Cuando el nuevo estado depende del estado anterior, pasa una función a `set`. Esto garantiza que siempre trabajes con el valor más reciente.

[code:jsx]
import { useState } from 'react'

function ContadorFuncional() {
  const [count, setCount] = useState(0)

  const incrementar = () => {
    setCount(prevCount => prevCount + 1)
  }

  return (
    <div>
      <p>Conteo: {count}</p>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  )
}
[endcode]

[st] Mini-proyecto: Chat

Un input y un botón. Cada mensaje enviado se acumula en pantalla como una ventana de chat.

[code:jsx]
import { useState } from 'react'

function App() {
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState("")

  function enviar() {
    if (texto === "") return
    setMensajes([...mensajes, texto])
    setTexto("")
  }

  return (
    <div>
      {mensajes.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe un mensaje"
      />
      <button onClick={enviar}>Enviar</button>
    </div>
  )
}

export default App
[endcode]

Puntos clave del mini-proyecto:

[list]
`useState` con arreglo vacío como valor inicial: `useState([])`
Spread operator para agregar sin mutar: `setMensajes([...mensajes, texto])`
Limpiar el input tras enviar: `setTexto("")`
Renderizar la lista con `.map()` y `key`
[endlist]

[st] Buenas Prácticas

[list]
No modifiques el estado directamente. Siempre usa la función `set` de `useState`
Para objetos y arrays, crea nuevas copias al actualizar (inmutabilidad)
Usa actualizaciones funcionales cuando el nuevo estado dependa del anterior
Si un objeto de estado crece mucho, divide en múltiples variables de estado
[endlist]
