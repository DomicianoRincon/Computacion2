[t] LLMs, Agentes y MCP Servers

[st] ¿Qué es un LLM?

Un Large Language Model (LLM) es un sistema de inteligencia artificial entrenado sobre enormes cantidades de texto. A diferencia de un buscador que indexa páginas, un LLM aprende patrones estadísticos del lenguaje: qué palabras suelen aparecer juntas, cómo se estructuran los argumentos, cómo se razona dentro de distintos dominios.

La arquitectura base de casi todos los LLMs modernos es el Transformer, propuesto por Google en 2017. Su elemento clave es el mecanismo de atención (attention), que permite al modelo relacionar cualquier parte del texto con cualquier otra simultáneamente — sin procesar en secuencia como los modelos anteriores.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="580" height="160" font-family="Roboto, Arial, sans-serif" font-size="13">
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#777"/>
    </marker>
  </defs>
  <rect x="10" y="60" width="90" height="40" rx="6" fill="#42A5F5"/>
  <text x="55" y="85" text-anchor="middle" fill="white" font-weight="bold">Tokens</text>
  <line x1="100" y1="80" x2="130" y2="80" stroke="#777" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="130" y="60" width="100" height="40" rx="6" fill="#AB47BC"/>
  <text x="180" y="85" text-anchor="middle" fill="white">Embedding</text>
  <line x1="230" y1="80" x2="260" y2="80" stroke="#777" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="260" y="40" width="130" height="80" rx="8" fill="#FFA726"/>
  <text x="325" y="75" text-anchor="middle" fill="white" font-weight="bold" font-size="14">Transformer</text>
  <text x="325" y="97" text-anchor="middle" fill="white" font-size="11">Attention + FFN × N</text>
  <line x1="390" y1="80" x2="420" y2="80" stroke="#777" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="420" y="60" width="140" height="40" rx="6" fill="#66BB6A"/>
  <text x="490" y="85" text-anchor="middle" fill="white" font-weight="bold">Próximo token</text>
  <text x="290" y="148" text-anchor="middle" fill="#888" font-size="12">Arquitectura simplificada de un Transformer</text>
</svg>
[endsvg]

El proceso de inferencia funciona así: el texto de entrada se divide en tokens (fragmentos de palabras), cada token se convierte en un vector numérico, y las capas del Transformer calculan cuál es el siguiente token más probable. Esto se repite hasta completar la respuesta.

Dos conceptos fundamentales para entender el comportamiento de un LLM:

[list]
Contexto (context window): cuántos tokens el modelo puede ver a la vez. Claude 3.5 Sonnet maneja hasta 200 000 tokens; GPT-4o tiene 128 000.
Temperatura: controla qué tan determinista es la respuesta. Temperatura 0 → siempre la opción más probable. Temperatura alta → respuestas más creativas y variadas.
[endlist]

[st] Herramientas de consola con IA

Claude Code y Gemini CLI son herramientas de línea de comandos que envuelven un LLM con capacidades adicionales: pueden leer archivos, ejecutar comandos de shell, navegar el sistema de archivos, buscar en la web, editar código, y mucho más.

Pero el LLM por sí solo no puede hacer nada de eso. Solo predice texto. La clave está en el sistema de tools.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="560" height="260" font-family="Roboto, Arial, sans-serif" font-size="13">
  <defs>
    <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#777"/>
    </marker>
  </defs>
  <!-- Usuario -->
  <rect x="10" y="100" width="110" height="50" rx="10" fill="#AB47BC"/>
  <text x="65" y="130" text-anchor="middle" fill="white" font-weight="bold">Usuario</text>
  <line x1="120" y1="125" x2="160" y2="125" stroke="#777" stroke-width="2" marker-end="url(#arr2)"/>
  <!-- LLM -->
  <rect x="160" y="90" width="130" height="70" rx="10" fill="#42A5F5"/>
  <text x="225" y="120" text-anchor="middle" fill="white" font-weight="bold" font-size="15">LLM</text>
  <text x="225" y="142" text-anchor="middle" fill="white" font-size="11">Claude / Gemini</text>
  <!-- Arrows LLM to tools -->
  <line x1="290" y1="108" x2="340" y2="40" stroke="#777" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="290" y1="118" x2="340" y2="100" stroke="#777" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="290" y1="132" x2="340" y2="165" stroke="#777" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="290" y1="142" x2="340" y2="225" stroke="#777" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- Tools -->
  <rect x="340" y="20" width="130" height="38" rx="6" fill="#66BB6A"/>
  <text x="405" y="44" text-anchor="middle" fill="white">read_file</text>
  <rect x="340" y="80" width="130" height="38" rx="6" fill="#66BB6A"/>
  <text x="405" y="104" text-anchor="middle" fill="white">bash</text>
  <rect x="340" y="146" width="130" height="38" rx="6" fill="#66BB6A"/>
  <text x="405" y="170" text-anchor="middle" fill="white">web_search</text>
  <rect x="340" y="210" width="130" height="38" rx="6" fill="#66BB6A"/>
  <text x="405" y="234" text-anchor="middle" fill="white">write_file</text>
  <text x="270" y="26" text-anchor="middle" fill="#888" font-size="12">El LLM orquesta las tools disponibles</text>
</svg>
[endsvg]

Las tools se describen al LLM dentro del system prompt como especificaciones JSON Schema. El modelo aprende qué puede invocar y decide cuándo hacerlo basándose en el prompt del usuario.

[code:json]
{
  "name": "read_file",
  "description": "Lee el contenido de un archivo del sistema de archivos local",
  "parameters": {
    "type": "object",
    "properties": {
      "file_path": {
        "type": "string",
        "description": "Ruta absoluta al archivo a leer"
      }
    },
    "required": ["file_path"]
  }
}
[endcode]

[st] El sistema de Tools por dentro

Cuando una herramienta como Claude Code o Gemini CLI recibe tu prompt, el ciclo es:

[list]
El sistema prepara un mensaje al LLM que incluye: tu prompt + la lista completa de tools disponibles con sus schemas JSON.
El LLM analiza el contexto y responde con texto O con una llamada a una tool en formato estructurado.
Si el LLM llama a una tool, el sistema ejecuta la función real (lee el archivo, corre el comando, etc.) y devuelve el resultado al LLM.
El LLM procesa el resultado y decide si necesita otra tool o ya puede responder al usuario.
[endlist]

Este ciclo se llama el loop de agente. Puede iterar muchas veces antes de dar una respuesta final. El usuario solo ve el resultado — el razonamiento intermedio ocurre de manera transparente.

[st] Flujo agéntico: un ejemplo práctico

Supón que escribes: "Lee el archivo Main.java y dime si hay algún bug"

[mermaid]
sequenceDiagram
  participant U as Usuario
  participant LLM as LLM (Claude)
  participant T as Sistema de Tools

  U->>LLM: "Lee Main.java y dime si hay algún bug"
  Note over LLM: Razona: necesito ver el archivo primero
  LLM->>T: tool_call: read_file("Main.java")
  T->>LLM: [contenido del archivo Java]
  Note over LLM: Analiza el código, detecta NullPointer en línea 34
  LLM->>U: "Hay un NullPointerException potencial en línea 34..."
[endmermaid]

Ahora uno más complejo: "Busca el último release de Spring Boot y actualiza el pom.xml"

[mermaid]
sequenceDiagram
  participant U as Usuario
  participant LLM as LLM (Claude)
  participant T as Sistema de Tools

  U->>LLM: "Actualiza Spring Boot al último release"
  Note over LLM: Necesito la versión actual y la más nueva
  LLM->>T: tool_call: read_file("pom.xml")
  T->>LLM: [pom.xml — versión actual: 3.2.0]
  LLM->>T: tool_call: web_search("Spring Boot latest release 2025")
  T->>LLM: [Spring Boot 3.5.0 — Mayo 2025]
  Note over LLM: Tengo todo, puedo hacer el cambio
  LLM->>T: tool_call: edit_file("pom.xml", old="3.2.0", new="3.5.0")
  T->>LLM: [archivo actualizado exitosamente]
  LLM->>U: "Actualicé Spring Boot de 3.2.0 a 3.5.0 en pom.xml"
[endmermaid]

El LLM no ejecuta código directamente — razona qué secuencia de tools necesita y las va llamando en orden hasta completar la tarea.

[st] MCP Servers: extendiendo el sistema de tools

MCP (Model Context Protocol) es un protocolo abierto creado por Anthropic en 2024 que estandariza cómo los LLMs se conectan a herramientas y fuentes de datos externas.

Antes de MCP, cada herramienta de IA integraba sus propias APIs de forma ad-hoc. MCP define un contrato estándar para que cualquier sistema externo pueda exponer tools a cualquier LLM compatible.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="580" height="270" font-family="Roboto, Arial, sans-serif" font-size="13">
  <defs>
    <marker id="arr3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#777"/>
    </marker>
    <marker id="arr3r" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
      <path d="M8,0 L8,6 L0,3 z" fill="#777"/>
    </marker>
  </defs>
  <!-- LLM Host -->
  <rect x="10" y="95" width="140" height="80" rx="10" fill="#42A5F5"/>
  <text x="80" y="127" text-anchor="middle" fill="white" font-weight="bold" font-size="14">LLM Host</text>
  <text x="80" y="147" text-anchor="middle" fill="white" font-size="11">Claude Code</text>
  <text x="80" y="165" text-anchor="middle" fill="white" font-size="11">Gemini CLI</text>
  <!-- MCP Protocol -->
  <rect x="165" y="115" width="70" height="40" rx="6" fill="#FFA726"/>
  <text x="200" y="140" text-anchor="middle" fill="white" font-weight="bold">MCP</text>
  <line x1="150" y1="135" x2="165" y2="135" stroke="#777" stroke-width="2" marker-end="url(#arr3)"/>
  <line x1="165" y1="128" x2="150" y2="128" stroke="#777" stroke-width="2" marker-end="url(#arr3r)"/>
  <!-- MCP Servers -->
  <rect x="250" y="20" width="130" height="44" rx="8" fill="#AB47BC"/>
  <text x="315" y="40" text-anchor="middle" fill="white" font-weight="bold" font-size="12">MCP Server</text>
  <text x="315" y="57" text-anchor="middle" fill="white" font-size="11">GitHub</text>
  <rect x="250" y="108" width="130" height="44" rx="8" fill="#AB47BC"/>
  <text x="315" y="128" text-anchor="middle" fill="white" font-weight="bold" font-size="12">MCP Server</text>
  <text x="315" y="145" text-anchor="middle" fill="white" font-size="11">Google Calendar</text>
  <rect x="250" y="196" width="130" height="44" rx="8" fill="#AB47BC"/>
  <text x="315" y="216" text-anchor="middle" fill="white" font-weight="bold" font-size="12">MCP Server</text>
  <text x="315" y="233" text-anchor="middle" fill="white" font-size="11">PostgreSQL</text>
  <!-- Lines MCP → Servers -->
  <line x1="235" y1="128" x2="250" y2="42" stroke="#777" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="235" y1="133" x2="250" y2="130" stroke="#777" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="235" y1="138" x2="250" y2="218" stroke="#777" stroke-width="1.5" marker-end="url(#arr3)"/>
  <!-- External APIs -->
  <rect x="400" y="20" width="160" height="44" rx="8" fill="#66BB6A"/>
  <text x="480" y="47" text-anchor="middle" fill="white" font-size="11">api.github.com</text>
  <rect x="400" y="108" width="160" height="44" rx="8" fill="#66BB6A"/>
  <text x="480" y="135" text-anchor="middle" fill="white" font-size="11">calendar.google.com</text>
  <rect x="400" y="196" width="160" height="44" rx="8" fill="#66BB6A"/>
  <text x="480" y="223" text-anchor="middle" fill="white" font-size="11">postgres://localhost</text>
  <!-- Lines Servers → APIs -->
  <line x1="380" y1="42" x2="400" y2="42" stroke="#777" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="380" y1="130" x2="400" y2="130" stroke="#777" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="380" y1="218" x2="400" y2="218" stroke="#777" stroke-width="1.5" marker-end="url(#arr3)"/>
  <text x="290" y="260" text-anchor="middle" fill="#888" font-size="12">Un protocolo estándar, múltiples integraciones</text>
</svg>
[endsvg]

Un MCP Server es un proceso independiente que expone un conjunto de tools a través del protocolo MCP. Cuando configuras un MCP Server en Claude Code, el LLM recibe automáticamente la lista de tools que ese server provee — exactamente igual que las tools nativas.

[st] Qué expone un MCP Server

El protocolo MCP define tres tipos de capacidades que un server puede publicar:

[list]
Tools: funciones que el LLM puede invocar (leer un email, crear un evento, consultar una base de datos, abrir un PR)
Resources: datos que el LLM puede leer como contexto (un archivo, el estado de un sistema, una página web)
Prompts: plantillas de prompts reutilizables que el server provee para tareas comunes
[endlist]

La comunicación ocurre vía JSON-RPC sobre stdio o HTTP. El host (Claude Code) actúa como cliente MCP; el server, como proveedor de capacidades.

[code:json]
// El host pregunta qué tools ofrece el MCP Server
{ "jsonrpc": "2.0", "method": "tools/list", "id": 1 }

// Respuesta del MCP Server:
{
  "result": {
    "tools": [
      {
        "name": "create_calendar_event",
        "description": "Crea un evento en Google Calendar",
        "inputSchema": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "start": { "type": "string", "format": "date-time" },
            "attendees": { "type": "array", "items": { "type": "string" } }
          },
          "required": ["title", "start"]
        }
      }
    ]
  }
}
[endcode]

[st] Ejemplo completo: tarea de la vida diaria con MCP

Le dices a Claude Code: "Revisa mis emails de hoy y agenda los eventos de las reuniones a las que me invitaron"

Con los MCP Servers de Gmail y Google Calendar configurados, el flujo agéntico cruza ambos sistemas:

[mermaid]
sequenceDiagram
  participant U as Usuario
  participant LLM as Claude Code
  participant GM as MCP: Gmail
  participant GC as MCP: Google Calendar

  U->>LLM: "Agrega a mi calendario las reuniones de mis emails de hoy"
  Note over LLM: Primero necesito leer los emails de hoy
  LLM->>GM: search_threads(query="reunión invitation", date="2025-05-05")
  GM->>LLM: [3 emails con invitaciones: Standup 9h, Code Review 11h, Sprint Review 15h]
  Note over LLM: Extraigo hora, título y asistentes de cada email
  LLM->>GC: create_event(title="Standup", start="09:00", attendees=[...])
  GC->>LLM: [evento creado ✓]
  LLM->>GC: create_event(title="Code Review", start="11:00", attendees=[...])
  GC->>LLM: [evento creado ✓]
  LLM->>GC: create_event(title="Sprint Review", start="15:00", attendees=[...])
  GC->>LLM: [evento creado ✓]
  LLM->>U: "Agregué 3 eventos: Standup 9h, Code Review 11h, Sprint Review 15h"
[endmermaid]

El LLM nunca accede directamente a Gmail ni a Google Calendar. Cada MCP Server actúa como intermediario seguro: recibe la llamada del LLM, ejecuta la acción real contra la API correspondiente, y devuelve el resultado.

[st] Configurar MCP Servers en Claude Code

Los MCP Servers se configuran en el archivo `claude.json`, a nivel global (`~/.claude/claude.json`) o por proyecto (`.claude/claude.json`):

[code:json]
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "@claude-ai/mcp-gmail"],
      "env": {
        "GOOGLE_CLIENT_ID": "tu-client-id",
        "GOOGLE_CLIENT_SECRET": "tu-secret"
      }
    },
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@claude-ai/mcp-google-calendar"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_tutoken"
      }
    }
  }
}
[endcode]

Una vez configurados, el LLM tiene acceso a todas las tools de todos los servers. Puedes combinar tools de diferentes servers en una sola tarea — Claude decide qué llamar y en qué orden.

[st] Resumen

[list]
Un LLM es un modelo estadístico de lenguaje basado en Transformers que predice el siguiente token dado un contexto.
Las herramientas de consola como Claude Code o Gemini CLI añaden un sistema de tools que permite al LLM interactuar con el mundo real.
El flujo agéntico es un loop: el LLM razona → llama una tool → procesa el resultado → decide si necesita más tools → responde.
MCP (Model Context Protocol) es el estándar abierto de Anthropic para conectar LLMs a sistemas externos de forma estandarizada.
Un MCP Server expone tools, resources y prompts al LLM a través de JSON-RPC sobre stdio o HTTP.
Combinando múltiples MCP Servers, el LLM puede orquestar tareas complejas que cruzan múltiples sistemas.
[endlist]
