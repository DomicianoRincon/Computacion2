# Ejercicio: Semántica REST

## Instrucciones

Para cada descripción de endpoint, define:

- El método HTTP correcto (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- La URL con semántica REST correcta

Recuerde: use sustantivos en plural, sin verbos en la URL, y `{id}` para identificadores de recursos.

## Ejercicio 1

Obtener la lista completa de todos los productos disponibles en el sistema.

```plain
Método: ?
URL:    ?
```

## Ejercicio 2

Registrar un nuevo estudiante en el sistema.

```plain
Método: ?
URL:    ?
```

## Ejercicio 3

Obtener los datos de un curso específico identificado por su id.

```plain
Método: ?
URL:    ?
```

## Ejercicio 4

Actualizar únicamente el email de un usuario existente. Los demás campos no deben cambiar.

```plain
Método: ?
URL:    ?
```

## Ejercicio 5

Eliminar un comentario identificado por su id.

```plain
Método: ?
URL:    ?
```

## Ejercicio 6

Buscar productos por nombre. El nombre llega como texto parcial para filtrar resultados.

```plain
Método: ?
URL:    ?
```

## Ejercicio 7

Obtener todos los estudiantes matriculados en un curso específico.

```plain
Método: ?
URL:    ?
```

## Ejercicio 8

Matricular un estudiante en un curso. El id del curso y el id del estudiante vienen en el cuerpo del request.

```plain
Método: ?
URL:    ?
```

## Ejercicio 9

Reemplazar completamente los datos de un empleado. Todos los campos del empleado serán sobreescritos.

```plain
Método: ?
URL:    ?
```

## Ejercicio 10

Obtener los pedidos de un usuario específico, con posibilidad de filtrar por estado del pedido (`pendiente`, `entregado`, `cancelado`).

```plain
Método: ?
URL:    ?
```

## Respuestas

```http
#1  GET     /productos
#2  POST    /estudiantes
#3  GET     /cursos/{id}
#4  PATCH   /usuarios/{id}
#5  DELETE  /comentarios/{id}
#6  GET     /productos?nombre=texto
#7  GET     /cursos/{id}/estudiantes
#8  POST    /matriculas
#9  PUT     /empleados/{id}
#10 GET     /usuarios/{id}/pedidos?estado=pendiente
```

## Errores comunes

Estos son los errores más frecuentes en cada ejercicio:

- `#1` — Usar `GET /getProductos` o `GET /listarProductos`. Los verbos no van en la URL.
- `#2` — Usar `GET /crearEstudiante`. Crear es `POST`, no `GET`.
- `#4` — Usar `PUT` cuando solo se actualiza un campo. `PUT` reemplaza todo el recurso; para cambios parciales use `PATCH`.
- `#6` — Usar `POST /buscarProductos`. Las búsquedas son consultas de lectura: `GET` con `@RequestParam`.
- `#7` — Usar `GET /getEstudiantesDeCurso/{id}`. El recurso principal es el que va en la URL: `/cursos/{id}/estudiantes`.
- `#8` — Usar `POST /matricularEstudiante`. La matrícula es el recurso que se crea: `/matriculas`.
- `#9` — Usar `PATCH` cuando se reemplazan todos los campos. `PATCH` es para actualizaciones parciales; `PUT` reemplaza el recurso completo.
- `#10` — Poner el filtro en la ruta: `/usuarios/{id}/pedidos/pendiente`. Los filtros opcionales van como `@RequestParam`, no en la ruta.
