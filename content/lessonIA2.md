[t] Skills en Herramientas de IA

[st] ¿Qué es una Skill?

Una skill es un módulo de comportamiento especializado que le "enseñas" a tu herramienta de IA para que adopte un rol o metodología concreta cuando se lo pidas. En vez de describir cada vez cómo debe responder, escribes la skill una sola vez y la activas con un slash command.

Piénsalo como un perfil de trabajo recargable. El mismo LLM puede comportarse como un redactor técnico, un revisor de seguridad, o un escritor de specs — según qué skill esté activa en esa conversación.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="560" height="200" font-family="Roboto, Arial, sans-serif" font-size="13">
  <defs>
    <marker id="sk1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#777"/>
    </marker>
  </defs>
  <!-- User -->
  <rect x="10" y="80" width="100" height="40" rx="8" fill="#AB47BC"/>
  <text x="60" y="105" text-anchor="middle" fill="white" font-weight="bold">Usuario</text>
  <!-- Prompt -->
  <line x1="110" y1="100" x2="155" y2="100" stroke="#777" stroke-width="2" marker-end="url(#sk1)"/>
  <text x="132" y="92" text-anchor="middle" fill="#888" font-size="11">/spec-writer</text>
  <!-- LLM box -->
  <rect x="155" y="60" width="140" height="80" rx="10" fill="#42A5F5"/>
  <text x="225" y="93" text-anchor="middle" fill="white" font-weight="bold" font-size="15">LLM</text>
  <text x="225" y="115" text-anchor="middle" fill="white" font-size="11">+ SKILL.md inyectada</text>
  <text x="225" y="132" text-anchor="middle" fill="white" font-size="11">como system prompt</text>
  <!-- Arrow to output -->
  <line x1="295" y1="100" x2="340" y2="100" stroke="#777" stroke-width="2" marker-end="url(#sk1)"/>
  <!-- Output -->
  <rect x="340" y="40" width="200" height="120" rx="10" fill="#66BB6A"/>
  <text x="440" y="68" text-anchor="middle" fill="white" font-weight="bold">Spec + Plan + Tasks</text>
  <text x="440" y="90" text-anchor="middle" fill="white" font-size="11">en formato estructurado</text>
  <text x="440" y="110" text-anchor="middle" fill="white" font-size="11">con criterios binarios</text>
  <text x="440" y="130" text-anchor="middle" fill="white" font-size="11">y assumptions visibles</text>
  <text x="280" y="185" text-anchor="middle" fill="#888" font-size="12">La skill modifica el comportamiento del LLM vía system prompt</text>
</svg>
[endsvg]

[st] Estructura de una Skill

Una skill vive en un archivo `SKILL.md` dentro de una carpeta con el nombre de la skill. Tiene dos partes: un frontmatter YAML con metadatos para que el LLM sepa cuándo activarla, y el cuerpo con el prompt de sistema que define el comportamiento.

[code:plain]
---
name: nombre-de-la-skill
description: >
  Descripción de cuándo usar esta skill.
  Trigger keywords: palabra1, palabra2, palabra3.
---

# Título de la skill

Aquí va el prompt de sistema completo. Le dice al LLM cómo
debe comportarse, qué formato de respuesta usar, qué
restricciones respetar, qué artefactos producir, etc.
[endcode]

[st] Instalar una Skill en Claude Code

Claude Code busca skills en dos ubicaciones:

[list]
Global: `~/.claude/skills/` — disponible en cualquier proyecto
Por proyecto: `.claude/skills/` — solo en ese directorio
[endlist]

La estructura de carpetas es:

[code:bash]
.claude/
└── skills/
    └── spec-writer/
        └── SKILL.md
[endcode]

Para activar la skill en una conversación, usas el slash command con el nombre de la carpeta:

[code:bash]
/spec-writer Agrega exportación de pedidos como CSV
[endcode]

Claude inyecta el contenido de `SKILL.md` como system prompt adicional antes de responder. El LLM adopta el rol definido en la skill durante esa invocación.

[st] Instalar una Skill en Gemini CLI

Gemini CLI usa exactamente la misma convención de `SKILL.md`, pero bajo la carpeta `.gemini/`:

[code:bash]
.gemini/
└── skills/
    └── spec-writer/
        └── SKILL.md
[endcode]

Para vincular la skill al workspace de Gemini, ejecutas:

[code:bash]
gemini skills link ./skills/spec-writer --scope workspace
[endcode]

El flag `--scope workspace` hace que la skill quede disponible para todos los proyectos del workspace actual.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="540" height="200" font-family="Roboto, Arial, sans-serif" font-size="13">
  <defs>
    <marker id="sk2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#777"/>
    </marker>
  </defs>
  <!-- SKILL.md file -->
  <rect x="20" y="70" width="120" height="60" rx="8" fill="#FFA726"/>
  <text x="80" y="96" text-anchor="middle" fill="white" font-weight="bold">SKILL.md</text>
  <text x="80" y="116" text-anchor="middle" fill="white" font-size="11">frontmatter + prompt</text>
  <!-- Arrow to Claude -->
  <line x1="140" y1="100" x2="200" y2="70" stroke="#777" stroke-width="1.5" marker-end="url(#sk2)"/>
  <!-- Arrow to Gemini -->
  <line x1="140" y1="100" x2="200" y2="130" stroke="#777" stroke-width="1.5" marker-end="url(#sk2)"/>
  <!-- Claude -->
  <rect x="200" y="40" width="150" height="50" rx="8" fill="#42A5F5"/>
  <text x="275" y="63" text-anchor="middle" fill="white" font-weight="bold">Claude Code</text>
  <text x="275" y="81" text-anchor="middle" fill="white" font-size="11">.claude/skills/</text>
  <!-- Gemini -->
  <rect x="200" y="110" width="150" height="50" rx="8" fill="#66BB6A"/>
  <text x="275" y="133" text-anchor="middle" fill="white" font-weight="bold">Gemini CLI</text>
  <text x="275" y="151" text-anchor="middle" fill="white" font-size="11">.gemini/skills/</text>
  <!-- Label -->
  <text x="80" y="155" text-anchor="middle" fill="#888" font-size="11">mismo archivo,</text>
  <text x="80" y="170" text-anchor="middle" fill="#888" font-size="11">dos herramientas</text>
  <text x="270" y="190" text-anchor="middle" fill="#888" font-size="12">El mismo SKILL.md funciona en Claude Code y Gemini CLI</text>
</svg>
[endsvg]

[st] Skill de ejemplo: spec-writer

A continuación la skill `spec-writer` completa. Al activarla, el LLM convierte cualquier descripción vaga de feature en tres artefactos estructurados: Spec funcional, Plan técnico y Tasks ordenadas.

[code:plain]
---
name: spec-writer
description: >
  Turns vague feature requests into structured specs, technical plans, and
  ordered task breakdowns ready for any coding agent. Use this skill when the
  user provides a feature description, a ticket, a PRD fragment, or any rough
  idea and asks to "write a spec", "plan this feature", "break this into
  tasks", or similar. Trigger keywords: spec, plan, tasks, feature, PRD,
  breakdown, acceptance criteria.
---

# spec-writer

You are an expert in Spec Driven Development (SDD). When this skill is active,
your job is to turn a vague feature description into three structured artifacts
— a Spec, a Plan, and a Task breakdown — in a single response.

## How to respond

Generate all three sections immediately. Do NOT ask clarifying questions first.
Instead, mark every implicit decision you make with `[ASSUMPTION: ...]` inline,
then collect all assumptions into a prioritized list at the end.

---

## Output format

### 1. Spec (functional, technology-agnostic)

- **Purpose**: One sentence describing what the feature does and why.
- **Users**: Who interacts with this feature and in what context.
- **Requirements**: Numbered list of functional requirements.
- **Edge cases**: What can go wrong, boundary conditions, unauthorized access.
- **Acceptance criteria**: Written in Given/When/Then format. Each criterion
  must be binary — pass or fail. "Works correctly" is NOT a valid criterion.
  "Returns 401 when unauthenticated" is.

### 2. Plan (technical and concrete)

- **Architecture**: Where this fits in the existing system. New services,
  modules, or layers required.
- **Data model**: New or modified entities, fields, relationships, indexes.
- **API contracts**: Endpoints, methods, request/response shapes, status codes.
- **Testing strategy**: Unit, integration, and e2e coverage expectations.
- **Security constraints**: Auth, authorization, rate limiting, input
  validation.
- **Dependencies**: External services, libraries, or internal modules required.

### 3. Tasks (ordered, self-contained)

Each task must:
- Be completable in a single agent session.
- Have its own acceptance criteria (binary, testable).
- List any tasks it depends on.
- Never say "implement the feature" — be specific.

Format each task as:

```
Task N: [Title]
Depends on: Task X (or "none")
What to build: [Specific, concrete description]
Acceptance criteria:
- [Binary criterion]
- [Binary criterion]
```

---

## Assumptions summary (end of every response)

After the three sections, output:

```
## Assumptions to review

1. [Decision made] — Impact: HIGH | MEDIUM | LOW
   Correct this if: [when the assumption is wrong]

2. ...
```

Order by impact descending. Include every non-obvious decision made during
generation.

---

## Quality rules

- The Spec MUST NOT contain implementation details (framework choices,
  library names). Those go in the Plan.
- Every assumption is visible. Nothing is hidden.
- Every task is independently verifiable. If it cannot be tested on its own,
  split it.
- Acceptance criteria are binary. Rewrite any criterion that contains
  subjective language.

---

## Example invocation

User: `/spec-writer Add a way for users to export their order history as CSV`

You generate:
1. Spec — what the export does, who uses it, edge cases, Given/When/Then
   criteria.
2. Plan — async job vs synchronous, S3 vs inline response, API contract,
   auth model, test strategy.
3. Tasks — in dependency order, each independently testable.
4. Assumptions — e.g. async for >1,000 rows (HIGH), date range filter
   required (MEDIUM).
[endcode]

[st] Cómo se instala paso a paso

Para tener la skill `spec-writer` disponible en Claude Code en tu proyecto:

[code:bash]
# 1. Crear la estructura de carpetas
mkdir -p .claude/skills/spec-writer

# 2. Crear el archivo SKILL.md con el contenido de la skill
# (pegar el contenido mostrado arriba)
touch .claude/skills/spec-writer/SKILL.md

# 3. Verificar que Claude la detecta
# Abrir Claude Code en el proyecto y escribir:
/spec-writer
[endcode]

Para Gemini CLI en el mismo proyecto:

[code:bash]
# 1. Crear la estructura de carpetas
mkdir -p .gemini/skills/spec-writer

# 2. Copiar el mismo SKILL.md
cp .claude/skills/spec-writer/SKILL.md .gemini/skills/spec-writer/SKILL.md

# 3. Vincular la skill al workspace
gemini skills link ./.gemini/skills/spec-writer --scope workspace
[endcode]

[st] ¿Cuándo usar una Skill?

[list]
Cuando repites el mismo tipo de tarea constantemente (escribir specs, revisar PRs, generar tests).
Cuando quieres que el LLM produzca un formato de respuesta específico y consistente.
Cuando trabajas en equipo y quieres que todos obtengan el mismo comportamiento del LLM.
Cuando el contexto o rol del LLM es demasiado largo para escribirlo en cada prompt.
[endlist]

Una skill bien escrita elimina la fricción de describir el "cómo" cada vez — te concentras solo en el "qué".
