# Introducción a Thymeleaf para Vistas Dinámicas

## ¿Qué es Thymeleaf?

Hasta ahora, nuestros controladores con `@RestController` devuelven datos crudos en formato JSON. Esto es ideal para APIs que serán consumidas por clientes como React o aplicaciones móviles. Sin embargo, a veces queremos que nuestro propio servidor genere y sirva las páginas HTML completas.

Thymeleaf es un "motor de plantillas" para Java que se especializa en esto. Nos permite crear plantillas HTML y, desde nuestro controlador, inyectar datos dinámicamente en ellas antes de enviarlas al navegador. Este enfoque se conoce como Server-Side Rendering (SSR).

## Configuración

Para empezar a usar Thymeleaf, solo necesitas agregar la dependencia `spring-boot-starter-thymeleaf` a tu `pom.xml`. Spring Boot la detectará y configurará todo automáticamente.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

Por convención, Spring Boot buscará tus plantillas HTML con extensión `.html` en el directorio: `src/main/resources/templates/`.

## De `@RestController` a `@Controller`

La diferencia clave es que `@RestController` está optimizado para devolver datos (como JSON), mientras que `@Controller` está diseñado para devolver vistas.

Veamos un controlador simple que usa Thymeleaf:

```java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // El objeto Model es el puente para enviar datos a la vista.
        model.addAttribute("message", "Hola desde Computación en Internet II");
        
        // Usamos el nombre del archivo HTML 
        // que se encuentra en src/main/resources/templates/
        return "home"; 
    }
}
```

Y esta sería la plantilla `home.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Inicio</title>
</head>
<body>
    <!-- th:text reemplaza el contenido de la etiqueta h1 -->
    <h1 th:text="${message}">Este texto será reemplazado</h1>
</body>
</html>
```

## Enviando Datos a la Plantilla

Podemos pasar cualquier tipo de objeto a la vista a través del `Model`.

## 1. Pasando un Objeto

Vamos a pasar un objeto `Student` a una vista de detalle.

Controlador:

```java
@GetMapping("/student-detail")
public String detalleEstudiante(Model model) {
    // En una app real, obtendrías este estudiante del service.
    Student student = new Student();
    student.setName("Juan Pérez");
    student.setCode("A00123456");
    student.setProgram("Ingeniería de Sistemas");

    model.addAttribute("student", student);
    return "detail"; // Renderiza detail.html
}
```

Plantilla `detail.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <h2>Información del Estudiante</h2>
    <p>Nombre: <span th:text="${student.name}">Nombre...</span></p>
    <p>Código: <span th:text="${student.code}">Código...</span></p>
    <p>Programa: <span th:text="${student.program}">Programa...</span></p>
</body>
</html>
```

## 2. Pasando una Lista

Para mostrar una lista de estudiantes, usamos el atributo `th:each`.

Controlador:

```java
@GetMapping("/students")
public String listarEstudiantes(Model model) {
    // En una app real, esta lista vendría del service.
    List<Student> students = List.of(
        new Student("Juan Pérez", "A00123456", "Ingeniería de Sistemas"),
        new Student("Ana Gómez", "A00654321", "Medicina")
    );

    model.addAttribute("studentsList", students); 
    return "student-list"; // Renderiza student-list.html
}
```

Plantilla `student-list.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <h2>Lista de Estudiantes</h2>
    <ul>
        <li th:each="s : ${studentsList}">
            <strong th:text="${s.name}"></strong> - 
            <span th:text="${s.program}"></span>
        </li>
    </ul>
</body>
</html>
```

## Recibiendo Datos con Formularios

Thymeleaf también simplifica el envío de datos desde el cliente al servidor.

`Paso 1`
Preparar el Controlador para mostrar el formulario
El controlador necesita enviar a la plantilla un objeto "vacío" que Thymeleaf usará para enlazar los campos del formulario.

```java
@Controller
@RequestMapping("/courses")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    @Autowired
    private ProfessorService professorService;

    @GetMapping("/new")
    public String showCourseForm(Model model) {
        // Objeto vacío para el nuevo curso
        model.addAttribute("course", new Course()); 
        // Lista de profesores para el dropdown
        model.addAttribute("professors", professorService.getAllProfessors());
        return "course-form";
    }
}
```

`Paso 2`
Crear el Formulario HTML con Thymeleaf
En `course-form.html`, usamos `th:action` para la URL de envío y `th:object` para enlazar el formulario con el objeto `course` que pasamos desde el controlador. `th:field` conecta cada `input` a una propiedad del objeto.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <h2>Crear Nuevo Curso</h2>
    <form th:action="@{/courses/save}" th:object="${course}" method="post">
        
        <label>Nombre del Curso:</label>
        <input type="text" th:field="*{name}" required>
        <br>
        <label>Créditos:</label>
        <input type="number" th:field="*{credits}" required>
        <br>
        <label>Profesor:</label>
        <select th:field="*{professor}">
            <option th:each="prof : ${professors}"
                    th:value="${prof.id}"
                    th:text="${prof.name}">
            </option>
        </select>
        <br>
        <button type="submit">Guardar Curso</button>
    </form>
</body>
</html>
```

`Paso 3`
Crear el Controlador para recibir los datos
Este método maneja la petición `POST` del formulario. La anotación `@ModelAttribute` toma los datos del formulario y los convierte en un objeto `Course` automáticamente.

```java
// Dentro de CourseController

@PostMapping("/save")
public String saveCourse(@ModelAttribute Course course) {
    courseService.saveCourse(course);
    // Redirigimos a otra página para evitar re-envíos del formulario
    return "redirect:/"; 
}
```

## Thymeleaf push-ups

Vamos a realizar ejericicios para afianzar estos conocimientos

```plain
https://github.com/DomicianoRincon/Computacion2
```

Realice las siguientes funciones usando platillas de thymeleaf (algunas están hechas arriba)

- Listar los estudiantes
- Listar los cursos
- Agrege un curso
- Agrege un estudiante
- Eliminar curso
- Eliminar estudiante
- Matricular un estudiante en un curso
- Eliminar matricula de un curso

## Resumen de Atributos Comunes

`th:text`: Reemplaza el contenido de una etiqueta con un valor.
`th:each`: Itera sobre una colección (List, Map, etc.).
`th:if` / `th:unless`: Muestra un elemento condicionalmente.
`th:object`: Enlaza un formulario a un objeto.
`th:field`: Enlaza un input a una propiedad de un objeto.
`th:action`: Especifica la URL a la que se enviará un formulario.
`th:href`: Crea un enlace (URL) dinámico.
`th:src`: Especifica una fuente (URL) para imágenes, scripts, etc.
`th:switch` / `th:case`: Equivalente a una estructura switch-case.

## Integrando CSS y JavaScript

Para que tus plantillas no solo sean dinámicas sino también atractivas, necesitas aplicar estilos CSS y, opcionalmente, añadir interactividad con JavaScript.

`Paso 1`: Organizar los archivos estáticos
Por convención, Spring Boot sirve archivos estáticos desde el directorio `src/main/resources/static`. Es una buena práctica crear subdirectorios para organizar tus recursos:

- `src/main/resources/static/css` para tus hojas de estilo.
- `src/main/resources/static/js` para tus archivos de JavaScript.
- `src/main/resources/static/images` para imágenes.

`Paso 2`: Enlazar el CSS en la plantilla HTML
Para enlazar tu hoja de estilo (por ejemplo, `styles.css`) en tu plantilla de Thymeleaf, usa la etiqueta `<link>` en el `<head>` del HTML. Es crucial usar `th:href` con la sintaxis `@{...}` para que Spring resuelva la URL correctamente.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Mi App</title>
    
    <!-- Sintaxis para enlazar un archivo CSS -->
    <link rel="stylesheet" type="text/css" th:href="@{/css/styles.css}">
</head>
<body>
    <!-- El contenido de tu página va aquí -->
</body>
</html>
```

Asegúrate de que el archivo `styles.css` exista en `src/main/resources/static/css/styles.css`. Thymeleaf y Spring Boot se encargarán de que la ruta `/css/styles.css` sea accesible para el navegador.
