# Parámetros HTTP en Spring

## Anatomía del HTTP Request

Los datos que el cliente envía al servidor pueden llegar por tres vías distintas en el mensaje HTTP.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="200" font-family="Roboto, monospace" font-size="12">
  <rect x="10" y="10" width="500" height="180" rx="8" fill="#1a1f2e" stroke="#333" stroke-width="1"/>

  <text x="20" y="36" fill="#aaa" font-size="11">REQUEST LINE</text>
  <text x="30" y="58" fill="#FFA726" font-weight="bold" font-size="13">POST /cursos/42/estudiantes?notify=true HTTP/1.1</text>

  <line x1="20" y1="68" x2="500" y2="68" stroke="#333" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="20" y="84" fill="#aaa" font-size="11">HEADERS</text>
  <text x="30" y="102" fill="#888">Authorization: Bearer eyJhbGc...</text>
  <text x="30" y="118" fill="#888">Content-Type: application/json</text>

  <line x1="20" y1="128" x2="500" y2="128" stroke="#333" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="20" y="144" fill="#aaa" font-size="11">BODY</text>
  <text x="30" y="163" fill="#AB47BC">{"nombre": "Juan", "email": "juan@uni.edu"}</text>

  <text x="30" y="190" fill="#66BB6A" font-size="10">↑ @PathVariable: /42</text>
  <text x="210" y="190" fill="#42A5F5" font-size="10">↑ @RequestParam: ?notify=true</text>
</svg>
```

## @PathVariable

`@PathVariable` extrae un segmento de la URL. Se usa cuando el identificador forma parte de la ruta del recurso.

```java
@GetMapping("/{id}")
public ResponseEntity<UsuarioDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(usuarioService.findById(id));
}
// GET /usuarios/42  →  id = 42
```

Puede tener múltiples variables en la misma ruta:

```java
@GetMapping("/{cursoId}/estudiantes/{estudianteId}")
public ResponseEntity<EstudianteDTO> getEstudiante(
    @PathVariable Long cursoId,
    @PathVariable Long estudianteId
) {
    return ResponseEntity.ok(cursoService.getEstudiante(cursoId, estudianteId));
}
// GET /cursos/5/estudiantes/12
```

## @RequestParam

`@RequestParam` extrae parámetros del query string (`?clave=valor`). Se usa para filtros, búsquedas y paginación — datos opcionales que no identifican el recurso.

```java
@GetMapping
public ResponseEntity<List<UsuarioDTO>> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) String nombre
) {
    return ResponseEntity.ok(usuarioService.findAll(page, size, nombre));
}
// GET /usuarios?page=0&size=5&nombre=Juan
```

- `defaultValue` — valor por defecto si el parámetro no viene en la URL.
- `required = false` — el parámetro es opcional; si no viene, llega como `null`.
- Sin opciones, el parámetro es obligatorio y lanza error si falta.

## @RequestBody

`@RequestBody` deserializa el cuerpo JSON del request a un objeto Java. Se usa en `POST`, `PUT` y `PATCH` para recibir los datos del recurso.

```java
@PostMapping
public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioDTO dto) {
    UsuarioDTO created = usuarioService.save(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

El JSON que envía el cliente:

```json
{
  "nombre": "Juan",
  "email": "juan@universidad.edu"
}
```

Spring usa Jackson para convertir automáticamente el JSON a la clase `UsuarioDTO`. Los nombres de los campos JSON deben coincidir con los atributos de la clase.

## Comparativa: cuándo usar cada uno

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="200" font-family="Roboto, Arial, sans-serif" font-size="13">
  <rect x="10" y="10" width="500" height="180" rx="8" fill="#1a1f2e"/>
  <text x="30" y="38" fill="#aaa" font-size="12">ANOTACIÓN</text>
  <text x="170" y="38" fill="#aaa" font-size="12">DÓNDE VIENE EL DATO</text>
  <text x="360" y="38" fill="#aaa" font-size="12">EJEMPLO</text>
  <line x1="20" y1="45" x2="500" y2="45" stroke="#333" stroke-width="1"/>
  <text x="30" y="72" fill="#66BB6A" font-weight="bold">@PathVariable</text>
  <text x="170" y="72" fill="#ddd">Segmento de la URL</text>
  <text x="360" y="72" fill="#888">/cursos/42</text>
  <text x="30" y="108" fill="#42A5F5" font-weight="bold">@RequestParam</text>
  <text x="170" y="108" fill="#ddd">Query string</text>
  <text x="360" y="108" fill="#888">?page=0&amp;size=10</text>
  <text x="30" y="144" fill="#AB47BC" font-weight="bold">@RequestBody</text>
  <text x="170" y="144" fill="#ddd">Cuerpo JSON del request</text>
  <text x="360" y="144" fill="#888">{"nombre": "Ana"}</text>
</svg>
```

## Data Transfer Object (DTO)

Un DTO encapsula los datos que se intercambian entre el cliente y el servidor. Separa la representación externa de la entidad interna de base de datos.

- No exponga directamente sus entidades. Use DTOs para controlar qué datos se intercambian.
- Separe DTOs de entrada (`Request`) y de salida (`Response`) cuando la estructura difiera.
- Incluya solo los campos necesarios para cada operación.
- Evite lógica de negocio en los DTOs — solo atributos y constructores.
- Nombre los DTOs claramente: `UsuarioRequestDTO`, `UsuarioResponseDTO` o simplemente `UsuarioDTO`.
- Organice los DTOs en un paquete `dto` separado.

```java
// DTO de entrada — lo que el cliente envía al servidor
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password;
    // getters y setters
}

// DTO de salida — lo que el servidor devuelve al cliente
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    // no incluye password
    // getters y setters
}
```

## Buenas prácticas

- Siempre retorne `ResponseEntity` para tener control total del código HTTP.
- Use el código de estado correcto: `201` al crear, `204` al eliminar, `404` cuando no existe.
- Nunca exponga sus entidades directamente — use DTOs.
- Versione su API desde el inicio: `/api/v1/recursos`.
- Use `@PathVariable` para identificadores de recursos y `@RequestParam` para filtros opcionales.
