[t] Props, Children y Listas

Los componentes de React son más útiles cuando pueden recibir datos del exterior. Para eso existen las **props**: los datos que un componente padre le pasa a un componente hijo.

[st] ¿Qué son las props?

Las props funcionan como los atributos en HTML, pero pueden ser cualquier valor de JavaScript: strings, números, arreglos, objetos o funciones.

[code:jsx]
function Tarjeta(props) {
  return (
    <div>
      <h2>{props.nombre}</h2>
      <p>{props.tipo}</p>
    </div>
  )
}

function App() {
  return (
    <div>
      <Tarjeta nombre="Sensor A" tipo="Temperatura" />
      <Tarjeta nombre="Sensor B" tipo="Humedad" />
    </div>
  )
}
[endcode]

[st] Desestructurar props

En lugar de acceder a `props.nombre`, puedes desestructurar directamente en la firma de la función. El resultado es el mismo, pero el código queda más limpio.

[code:jsx]
function Tarjeta({ nombre, tipo }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>{tipo}</p>
    </div>
  )
}
[endcode]

[st] La prop especial: children

`children` es una prop que React pasa automáticamente con el contenido que escribes entre las etiquetas de apertura y cierre de un componente. Sirve para crear componentes "contenedor" que envuelven a otros.

[code:jsx]
function Tarjeta({ titulo, children }) {
  return (
    <div className="tarjeta">
      <h2>{titulo}</h2>
      {children}
    </div>
  )
}
[endcode]

Para usarlo, en lugar de escribir el componente como etiqueta autocerrada (`<Tarjeta />`), escríbelo con apertura y cierre, y coloca el contenido adentro:

[code:jsx]
function App() {
  return (
    <Tarjeta titulo="Sensor A">
      <p>Temperatura: 22°C</p>
      <p>Estado: activo</p>
    </Tarjeta>
  )
}
[endcode]

Todo lo que esté entre `<Tarjeta>` y `</Tarjeta>` llega al componente como `children`. Puede ser texto, otros componentes, o cualquier JSX válido.

[st] Cuándo usar children

`children` es útil cuando el componente define la estructura (bordes, sombra, espaciado) pero el contenido interno varía según el contexto. Por ejemplo: tarjetas, modales, paneles, layouts.

[code:jsx]
function Panel({ titulo, children }) {
  return (
    <section style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      <h3>{titulo}</h3>
      {children}
    </section>
  )
}

function App() {
  return (
    <div>
      <Panel titulo="Dispositivos activos">
        <p>Sensor A — Temperatura</p>
        <p>Sensor B — Humedad</p>
      </Panel>

      <Panel titulo="Alertas">
        <p>Sin alertas recientes.</p>
      </Panel>
    </div>
  )
}
[endcode]

[st] Renderizar listas con .map()

Cuando tenemos un arreglo de datos, usamos `.map()` para convertir cada elemento en un componente. React requiere que cada elemento tenga una prop `key` única.

[code:jsx]
const dispositivos = [
  { id: 1, nombre: "Sensor A", tipo: "Temperatura" },
  { id: 2, nombre: "Sensor B", tipo: "Humedad" },
  { id: 3, nombre: "Sensor C", tipo: "Presión" },
]

function App() {
  return (
    <div>
      {dispositivos.map((dispositivo) => (
        <Tarjeta
          key={dispositivo.id}
          nombre={dispositivo.nombre}
          tipo={dispositivo.tipo}
        />
      ))}
    </div>
  )
}
[endcode]

La prop `key` no se muestra en pantalla. React la usa internamente para saber qué elementos actualizar cuando los datos cambian. Debe ser un valor único y estable —preferentemente el `id` del dato, no el índice del arreglo.

[st] Resumen

[list]
Las `props` son los datos que el padre le pasa al hijo
Se desestructuran directamente en la firma: `function Comp({ nombre, tipo })`
`children` es el contenido escrito entre las etiquetas del componente
`.map()` convierte un arreglo de datos en un arreglo de componentes
Cada elemento renderizado con `.map()` necesita una prop `key` única
[endlist]
