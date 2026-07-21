# Permisos en métodos

## Anotaciones de Seguridad en Métodos

Además de configurar la seguridad en el `SecurityFilterChain`, puede aplicar reglas de autorización directamente en los métodos de sus controladores o servicios. Esto se hace habilitando la seguridad de métodos y usando anotaciones como `@PreAuthorize`.

Primero, habilite la seguridad de métodos en su configuración:

```java
@Configuration
@EnableMethodSecurity // <-- Habilitar seguridad en métodos
public class WebSecurityConfig {
    // ... otros beans
}
```

Luego, puede usar `@PreAuthorize` en cualquier método para restringir el acceso. La anotación acepta expresiones de Spring Expression Language (SpEL).

Por ejemplo, para restringir un método a usuarios con el rol `PROFESSOR`:

```java
@RestController
@RequestMapping("/students")
public class StudentController {

    @GetMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    public List<Student> getAllStudents() {
        // ... Lógica para devolver estudiantes
    }
}
```

O para requerir un permiso específico:

```java
@RestController
@RequestMapping("/courses")
public class CourseController {

    @PostMapping("/edit")
    @PreAuthorize("hasAuthority('EDIT_COURSES')")
    public void editCourse(@RequestBody Course course) {
        // ... Lógica para editar el curso
    }
}
```

## Expresiones lógicas

Puedes usar and, or, not para reglas más finas:

```java
@PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
public void createExam() { ... }
```

## Validar argumentos del método

Puedes comparar parámetros que recibe el método con información del contexto de seguridad

```java
@PreAuthorize("#studentId == authentication.principal.id")
public Student getStudentProfile(Long studentId) { ... }
```

Esto asegura que un estudiante solo vea su propio perfil.

## Validar si el usuario está autenticado o anónimo

```java
@PreAuthorize("isAuthenticated()")
public void onlyLoggedUsers() { ... }

@PreAuthorize("isAnonymous()")
public void onlyGuests() { ... }

```

## Verificar datos de auth

```java
@GetMapping("/profile/{username}")
@PreAuthorize("#username == authentication.name")
public UserProfile getProfile(@PathVariable String username) {
    // ... Lógica para devolver el perfil de usuario
}
```
