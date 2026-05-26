[t] Tarea 4 · Quiz con API Pública

[st] Contexto

Trabajas como desarrollador freelance. Un cliente que organiza eventos de trivia para equipos corporativos te contrató para construir una aplicación web donde los participantes puedan practicar antes del evento real. El cliente no tiene preferencias tecnológicas: solo te entregó una lista de funcionalidades que necesita y te pidió que uses la Open Trivia DB, una API pública gratuita con miles de preguntas clasificadas por categoría y dificultad. Tu trabajo es construir esa aplicación usando React.

[st] La API

La [link] Open Trivia DB https://opentdb.com no requiere API key y expone los siguientes endpoints relevantes:

[list]
`GET https://opentdb.com/api_category.php` — devuelve la lista de todas las categorías disponibles
`GET https://opentdb.com/api.php` — devuelve preguntas filtradas por parámetros: `amount` (cantidad), `category` (id de categoría), `difficulty` (easy / medium / hard), `type` (multiple / boolean)
[endlist]

**Nota técnica:** las preguntas y respuestas de la API llegan con HTML entities codificadas (por ejemplo, `&quot;` en lugar de `"`, o `&#039;` en lugar de `'`). El texto debe mostrarse correctamente en pantalla.

[st] Política de uso de IA

El uso de herramientas de IA generativa está permitido dentro de los siguientes límites.

**Sí puedes usar IA para:**

[list]
Preguntar qué significa un mensaje de error o advertencia específico que estás viendo
Pedir que explique cómo funciona un hook o una función de JavaScript, sin que genere código tuyo
Pedir revisión de un fragmento de código de máximo 20 líneas que tú ya escribiste, siempre que puedas explicarlo con tus propias palabras
Buscar la sintaxis exacta de algo que ya entiendes conceptualmente
[endlist]

**No puedes usar IA para:**

[list]
Pedir que genere un componente, página o función completa
Describir uno de los requerimientos de esta tarea y pedir el código correspondiente
Pedirle que cree la estructura inicial del proyecto o los archivos base
Pedir que "arregle" algo sin entender primero qué está fallando
[endlist]

Todo uso de IA debe quedar registrado en la bitácora (ver sección **Entrega**).

[st] Requerimientos

Los siguientes requerimientos describen el comportamiento esperado de la aplicación. No especifican cómo implementarlo: eso es decisión tuya.

**R1 · Configuración antes de jugar**

Antes de iniciar una partida, el usuario puede elegir al menos una opción de juego (categoría, dificultad, o cantidad de preguntas). Las opciones disponibles deben cargarse dinámicamente desde la API, no estar escritas directamente en el código.

**R2 · Partida activa**

Las preguntas se presentan de a una. El usuario selecciona una respuesta y la aplicación le indica si fue correcta o incorrecta antes de avanzar a la siguiente. Una vez seleccionada, la respuesta no se puede cambiar.

**R3 · Resultado final**

Al terminar todas las preguntas, el usuario ve su puntaje (respuestas correctas sobre total). Desde ahí puede iniciar una nueva partida o cambiar las opciones de juego.

**R4 · Historial persistente**

La aplicación guarda el historial de las últimas 5 partidas (puntaje y fecha). Ese historial está disponible en una vista dedicada y persiste entre recargas de página.

**R5 · Navegación por URL**

Cada vista de la aplicación tiene su propia URL. Cualquier vista debe ser accesible directamente desde el navegador, no solo a través de la navegación interna de la app.

**R6 · Estados de carga y error**

Mientras la aplicación espera una respuesta de la API, comunica ese estado visualmente. Si la API falla o devuelve un resultado inesperado, se muestra un mensaje de error con la opción de reintentar.

**R7 · Llamadas HTTP**

Todas las llamadas HTTP se realizan usando una instancia de axios configurada con la `baseURL` de la API. No se puede usar `fetch` ni axios directamente sin instancia en ningún lugar del código.

[st] Entrega

La entrega consiste en un repositorio de GitHub con el código fuente del proyecto (Vite + React) y un archivo `README.md` con la bitácora del proyecto.

La bitácora debe incluir:

[list]
Una descripción de la estructura de componentes que elegiste (puede ser texto o un diagrama ASCII sencillo)
Explicación del contexto global: qué información guardaste ahí y por qué esas vistas en particular lo necesitan
Al menos dos decisiones de diseño con su justificación (por ejemplo: "decidí manejar el historial en el contexto y no directamente en localStorage porque...")
Lista de todos los prompts usados con herramientas de IA: qué preguntaste y para qué lo usaste
[endlist]

Comparte el link del repositorio a través del medio que indique el profesor.
