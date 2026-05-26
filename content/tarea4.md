[t] Tarea 4 · Quiz con API Pública

[st] Contexto

Trabajas como desarrollador freelance. Un cliente que organiza eventos de trivia para equipos corporativos te contrató para construir una aplicación web donde los participantes puedan practicar antes del evento real. El cliente no tiene preferencias tecnológicas: solo te entregó una lista de funcionalidades que necesita y te pidió que uses la Open Trivia DB, una API pública gratuita con miles de preguntas clasificadas por categoría y dificultad. Tu trabajo es construir esa aplicación usando React.

[st] La API
La Open Trivia DB https://opentdb.com no requiere API key y expone los siguientes endpoints relevantes:

[list]
`GET https://opentdb.com/api_category.php` — devuelve la lista de todas las categorías disponibles
`GET https://opentdb.com/api.php` — devuelve preguntas filtradas por parámetros (Request Params): `amount` (cantidad), `category` (id de categoría), `difficulty` (easy / medium / hard), `type` (multiple / boolean)
[endlist]

[st] Requerimientos

Los siguientes requerimientos describen el comportamiento esperado de la aplicación. Sus únicas armas son las que ha visto en clase. De modo que sí o sí debe usar `useState`, `useEffect`, el API de contexto, `axios`, diseño de componentes de la aplicación.

`R1 · Configuración antes de jugar`
Antes de iniciar una partida, el usuario puede elegir la cantidad de preguntas y la categoría

`R2 · Partida activa`
Las preguntas se presentan de a una. El usuario selecciona una respuesta y la aplicación le indica si fue correcta o incorrecta.

`R3 · Resultado final`
En todo momento, el usuario ve su puntaje (+1 por respuestas correctas, -1 por respuestas incorrectas). Desde ahí puede iniciar una nueva partida o cambiar las opciones de juego.

`R4 · Partida persistente`
La aplicación recuerda por qué parte del cuestionario va el usuario. Si recarga la página o la cierra y la vuelve a abrir, debe cargar la pregunta por la que iba el usuario y el puntaje que lleva.

`R5 · Puntaje final`
Al final, el usuario verá una pantalla con los resultados

[st] Componentes requeridos
La aplicación debe tener un componente llamado `QuestionCard` que muestra la pregunta de la trivia

[st] Entrega

`Repositorio (10%)`
La entrega consiste en un repositorio de GitHub con el código fuente del proyecto (Vite + React) y

`Bitácora (90%)`
Un archivo `README.md` con la bitácora del proyecto. Esta debe incluir

[list]
Una descripción de todos los componentes que componen la aplicación

Las variables que ha decido almacenar en el contexto global. Y para cada una, qué vistas necesitan ese contexto

Las variables de estado elegido para cada pantalla (useState)

Los efectos usados en cada pantalla (useEffect)

Lista de todos los prompts usados con herramientas de IA: qué preguntaste y para qué lo usaste. Si siguió el spec driven development, liste los prompts + los specs. NO OMITA DETALLE
[endlist]

[st] Classroom
https://classroom.github.com/a/voQsqveS