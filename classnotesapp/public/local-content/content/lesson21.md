# Navegación Dinámica

## El Escenario Común: Lista y Detalle

Una de las funcionalidades más comunes en aplicaciones web es mostrar una lista de elementos (como productos, usuarios o, en nuestro caso, estudiantes) y permitir al usuario hacer clic en uno de ellos para ver una página con información detallada.

Vamos a construir esto paso a paso con Spring Boot y Thymeleaf.

El flujo es el siguiente:
`1`  Página de Lista: Un usuario visita `/students`. El controlador busca todos los estudiantes y los muestra en una plantilla.
`2`  Navegación: En la lista, cada nombre de estudiante es un enlace que apunta a una URL única, como `/students/1`, `/students/2`, etc.
`3`  Página de Detalle: Al hacer clic en un enlace, el controlador intercepta la URL, extrae el ID del estudiante, busca la información de *ese* estudiante en específico y la muestra en una nueva plantilla de detalle.

## Paso 1: El Controlador para la Lista

Primero, modificamos el controlador que muestra la lista. La clave es generar un enlace (`<a>`) para cada estudiante en el bucle `th:each`.

Usaremos `th:href` junto con la expresión `@{...}` para construir una URL dinámica que incluya el ID del estudiante.

```html
...
<ul>
    <li th:each="s : ${studentsList}">
        <a th:href="@{/students/{id}(id=${student.id})}" th:text="${student.name}">
            Nombre del Estudiante
        </a>
    </li>
</ul>
```

Nótese esta sintaxis `@{/students/{id}(id=${student.id})}`
`@{...}` se usa para generar una referencia a la raíz de los controllers y se puede usar rutas relativas

`/students/{id}` es la sintaxis del controller. Aquí buscamos que podamos navegar hacia rutas como `/students/123`

`(id=${student.id})` se usa para que Thymeleaf reemplace el placeholder `{id}` con el valor real de `student.id` para cada estudiante en la iteración. El resultado será, por ejemplo, `/students/1`, `/students/2`, etc.

## Paso 2: El Controlador para la Vista de Detalle

Ahora, necesitamos un método en nuestro controlador que pueda manejar estas nuevas URLs (`/students/{id}`). Usamos la anotación `@PathVariable` para capturar el valor del ID desde la URL.

```java
@Controller
@RequestMapping("/students")
public class StudentController {

    ...

    @GetMapping("/{id}")
    public String studentDetail(@PathVariable("id") Long studentId, Model model) {
        Student student = studentService.findById(studentId);
        model.addAttribute("student", student);
        return "student-detail";
    }

    ...

}
```

## Paso 2 Alternativo:

Hay otra forma de recibir el id del estudiante como parámetro y es por medio de la sintaxis `/students?id=123`. Para esto necesita un método de controller que reciba correctamente el id.

```java
@Controller
@RequestMapping("/students")
public class StudentController {

    ...

    @GetMapping
    public String studentDetail(@RequestParam("id") Long studentId, Model model) {
        Student student = studentService.findById(studentId);
        model.addAttribute("student", student);
        return "student-detail";
    }

    ...

}
```

Y en la referencia en la plantilla queda un poco diferente:

```html
...
<ul>
    <li th:each="s : ${studentsList}">
        <a th:href="@{/students(id=${student.id})}" th:text="${student.name}">
            Nombre del Estudiante
        </a>
    </li>
</ul>
```

## Paso 3: La Plantilla para la Vista de Detalle

Finalmente, creamos la plantilla `student-detail.html`. Esta plantilla a `student` y mostrará todos sus atributos.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Detalle del Estudiante</title>
</head>
<body>
    <!-- Verificamos si el estudiante existe para evitar errores -->
    <div th:if="${student}">
        <h2 th:text="${student.name}">Nombre del Estudiante</h2>
        <p>
            <strong>Código:</strong>
            <span th:text="${student.code}">A00123456</span>
        </p>
        <p>
            <strong>Programa:</strong>
            <span th:text="${student.program}">Ingeniería de Sistemas</span>
        </p>
        <p>
            <strong>Email:</strong>
            <span th:text="${student.email}">correo@ejemplo.com</span>
        </p>
        <!-- Puedes agregar más campos aquí -->
        
        <hr>
        <a th:href="@{/students}">Volver a la lista</a>
    </div>

    <div th:unless="${student}">
        <h2>Estudiante no encontrado</h2>
        <p>El estudiante que buscas no existe.</p>
        <a th:href="@{/students}">Volver a la lista</a>
    </div>
</body>
</html>
```

## Competencia

Vamos a batirnos en un duelo de implementación. Recibirán tareas y deberán realizar la implementación.

Por tarea, se escogerán los 3 primeros estudiantes que levanten la mano. Se evaluará el desarrollo de cada tarea y posteriormente se otorgarán los puntos: 3 a la mejor implementación, 2 al siguiente y 1 al siguiente.

Se evulará que cumpla con la tarea y sumará cada detalle que le haya puesto. Sea gráfico o no.

`Instrucciones de participación`
1. Levanta la mano solo cuando estés listo para la revisión.
2. Los primeros 3 en alzar la mano serán revisados en vivo.
3. Si pides revisión, asegúrate de que tu aplicación es accesible desde LAN (IASLAB).
http://<IP>:8080/url/a/revisar
4. El profesor accederá a esa dirección en LAN, siendo proyectado en la clase

🎯 Una pantalla donde se vea la lista de cursos. Los elementos de lista son clickeables y al dar click puedo acceder al detalle del curso.

🎯 Agregue a la pantalla anterior un enlace en donde se muestra al profesor que al darle click, acceda a una pantalla de detalle del profesor donde muestra los cursos que tiene a su cargo.

🎯 A la pantalla de detalle del curso agréguele la lista de estudiantes del curso.

🎯 Haga que cada estudiante del curso es clickeable, al acceder al estudiante, puedo ver su deetalle.

🎯 Una pantalla de matrícula, donde el usuario pueda elegir el estudiante y la materia para crear la matrícula.
