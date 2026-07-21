# Mockito

Las pruebas de integración validan el sistema completo, pero tienen un costo: levantar el contexto de Spring tarda varios segundos por ejecución.

Mockito ofrece una alternativa: probar la capa de servicio de forma completamente aislada, sin base de datos ni contexto de Spring. En lugar de usar repositorios reales, simulamos sus respuestas con datos controlados. Las pruebas corren en milisegundos y se enfocan exclusivamente en la lógica de negocio.

El objetivo de `Mockito` es simular dependencias devolviendo datos controlados por quien escribe la prueba, para verificar cómo reacciona la lógica ante distintos escenarios.

## Dependencias

El módulo `spring-boot-starter-test` ya incluye Mockito. Si necesitas agregarlo manualmente:

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
```

## Activar Mockito

El punto de partida es una clase de test con la anotación `@ExtendWith(MockitoExtension.class)`. Esta anotación activa el motor de Mockito para la clase sin necesitar levantar ningún contexto de Spring.

```java
package com.example.myapp.services;

import com.example.myapp.model.Course;
import com.example.myapp.model.Professor;
import com.example.myapp.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {
}
```

A diferencia de `@SpringBootTest`, aquí no se levanta ningún contexto. Solo existe la clase de test y Mockito escuchando.

## Crear el Mock

Un `@Mock` es una implementación falsa de una clase o interfaz. Mockito la genera automáticamente y por defecto todos sus métodos no hacen nada: devuelven `null`, `0`, listas vacías, etc. Nosotros decidimos exactamente qué devolverá en cada test.

```java
@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

}
```

`courseRepository` ahora es una versión simulada. Cuando el servicio le llame a `findAll()` o `findById(...)`, nosotros controlamos qué responde.

## Inyectar el Mock en el Servicio

`@InjectMocks` crea una instancia real de `CourseService` e inyecta automáticamente los mocks que declaramos como sus dependencias. Equivale a hacer `new CourseService(courseRepository)` pero sin escribirlo.

```java
@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

}
```

`courseService` es el objeto real que vamos a probar. `courseRepository` es el objeto falso que le inyectamos como dependencia.

## Preparar los datos con `@BeforeEach`

En lugar de repetir la construcción de objetos en cada test, usamos `@BeforeEach` para crear los datos de prueba una sola vez antes de cada método. Esto mantiene los tests limpios y enfocados.

```java
@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Professor professor;
    private Course course1;
    private Course course2;

    @BeforeEach
    void setup() {
        professor = new Professor();
        professor.setId(1L);
        professor.setName("Alice Andrew");

        course1 = new Course();
        course1.setId(1L);
        course1.setProfessor(professor);
        course1.setName("Computación en Internet II");

        course2 = new Course();
        course2.setId(2L);
        course2.setProfessor(professor);
        course2.setName("Ingeniería de Software IV");
    }
}
```

A diferencia de las pruebas de integración, aquí no hay `@AfterEach` de limpieza porque no hay base de datos que limpiar.

## Simulando retornos de listas

Con la clase configurada, ya podemos escribir tests. Usa el patrón AAA y la convención `MethodName_WhenCondition_ExpectedBehavior`.

```java
@Test
void getAllCourses_WhenCalled_ReturnsCourseList() {
    // Arrange: definimos qué devolverá el repositorio cuando se le llame
    when(courseRepository.findAll()).thenReturn(Arrays.asList(course1, course2));

    // Act
    List<Course> courses = courseService.getAllCourses();

    // Assert
    assertEquals(2, courses.size());
    assertEquals("Computación en Internet II", courses.get(0).getName());
    assertEquals("Ingeniería de Software IV", courses.get(1).getName());
}
```

La estructura es: `when(llamado al repositorio).thenReturn(dato simulado)`. El servicio llama al repositorio, el repositorio devuelve lo que nosotros definimos, y probamos que el servicio lo procesa correctamente.

## Simulando retornos de Optionals

```java
@Test
void getCourseById_WhenExists_ReturnsCourse() {
    // Arrange
    when(courseRepository.findById(1L)).thenReturn(Optional.of(course1));

    // Act
    Course result = courseService.getCourseById(1L);

    // Assert
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("Computación en Internet II", result.getName());
}
```

`Optional.of(object)` simula que el repositorio encontró el registro. `Optional.empty()` simula que no lo encontró.

## Probando test negativos

```java
@Test
void getCourseById_WhenNotExists_ThrowsException() {
    // Arrange: el repositorio no encuentra nada
    when(courseRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> courseService.getCourseById(1L));
}
```

## Simulando métodos void

Para métodos que no devuelven valor la estructura cambia: `doNothing().when(mock).método()`.

```java
@Test
void deleteCourse_WhenExists_DeletesSuccessfully() {
    // Arrange
    doNothing().when(courseRepository).deleteById(1L);

    // Act
    courseService.deleteCourse(1L);

    // Assert: verificamos que el repositorio fue llamado exactamente una vez
    verify(courseRepository, times(1)).deleteById(1L);
}
```

`verify()` es la única forma de "afirmar" algo en tests de métodos void: confirma que el mock fue invocado el número de veces esperado.

## Simulando excepciones en métodos void

`doThrow` simula que el repositorio lanza una excepción, permitiendo probar cómo reacciona el servicio ante fallos.

```java
@Test
void deleteCourse_WhenRepositoryFails_ThrowsException() {
    // Arrange
    doThrow(new RuntimeException("DB error")).when(courseRepository).deleteById(1L);

    // Act & Assert
    assertThrows(RuntimeException.class, () -> courseService.deleteCourse(1L));
}
```

## Resumen de la API de Mockito

- `when(repo.method()).thenReturn(value)` — simula un método que devuelve un valor
- `when(repo.method()).thenReturn(Optional.of(obj))` — simula que se encontró un registro
- `when(repo.method()).thenReturn(Optional.empty())` — simula que no se encontró nada
- `doNothing().when(repo).method()` — simula un método void sin efecto
- `doThrow(new Ex()).when(repo).method()` — simula un método void que lanza excepción
- `verify(repo, times(1)).method()` — verifica que el método fue llamado N veces

## Retos

Implementa los mismos tests que hiciste con pruebas de integración, ahora usando Mockito. No necesitas base de datos ni `@AfterEach` de limpieza. Compara el tiempo de ejecución de ambas suites y reflexiona: ¿cuándo conviene cada enfoque?

Mockea `StudentRepository`. Verifica que el servicio lanza la excepción correcta cuando el repositorio devuelve `Optional.empty()`, y que retorna el estudiante cuando devuelve `Optional.of(student)`.

- `findStudentByCode_WhenCodeIsValid_ShouldReturnStudent`
- `findStudentByCode_WhenCodeDoesNotExist_ShouldThrowRuntimeException`
- `findStudentByCode_WhenCodeIsNull_ShouldThrowIllegalArgumentException`

Mockea `CourseRepository` y `StudentRepository`. Para el caso positivo necesitas que `courseRepository.existsByName(...)` devuelva `true` y que `studentRepository.findByStudentCourses_Course_Name(...)` devuelva la lista esperada.

- `getStudentsByCourseName_WhenCourseExists_ShouldReturnEnrolledStudents`
- `getStudentsByCourseName_WhenCourseHasNoStudents_ShouldReturnEmptyList`
- `getStudentsByCourseName_WhenCourseDoesNotExist_ShouldThrowRuntimeException`

Mockea `StudentRepository`. Usa `doNothing().when(...)` para el caso exitoso y verifica con `verify()` que `delete(student)` fue llamado exactamente una vez.

- `deleteStudentByCode_WhenStudentExists_ShouldRemoveFromDatabase`
- `deleteStudentByCode_WhenStudentDoesNotExist_ShouldThrowRuntimeException`

Mockea `StudentRepository`, `CourseRepository` y `StudentCourseRepository`. Este método consulta tres repositorios y tiene una verificación de estado: asegúrate de cubrir el caso en que `existsByStudentAndCourse(...)` devuelve `true`.

- `enrollStudentInCourse_WhenValid_ShouldReturnNewEnrollment`
- `enrollStudentInCourse_WhenAlreadyEnrolled_ShouldThrowIllegalStateException`
- `enrollStudentInCourse_WhenStudentNotFound_ShouldThrowRuntimeException`
- `enrollStudentInCourse_WhenCourseNotFound_ShouldThrowRuntimeException`

Mockea `StudentRepository`, `CourseRepository` y `StudentCourseRepository`. Este método es void, así que no hay valor de retorno que afirmar. La única forma de verificar que funcionó correctamente es con `verify()`: confirma que `delete(enrollment)` fue llamado exactamente una vez. Para el caso `WhenNotEnrolled`, haz que `findByStudentAndCourse(...)` devuelva `Optional.empty()`.

- `unenrollStudentFromCourse_WhenEnrolled_ShouldRemoveEnrollment`
- `unenrollStudentFromCourse_WhenNotEnrolled_ShouldThrowIllegalStateException`
- `unenrollStudentFromCourse_WhenStudentNotFound_ShouldThrowRuntimeException`
- `unenrollStudentFromCourse_WhenCourseNotFound_ShouldThrowRuntimeException`

Para ejecutar los test puede usar

```ini
# Todo
mvn test                                        
# Una clase                                                                                                                         
mvn test -Dtest=StudentServiceTest                  
# Un método                                               
mvn test -Dtest=StudentServiceTest#findStudentByCode_WhenExists_ReturnsStudent                                                      
# Varios métodos de la misma clase
mvn test -Dtest="StudentServiceTest#findStudentByCode_WhenExists_ReturnsStudent+findStudentByCode_WhenNotExists_ThrowsRuntimeException"
# Todas las clases de un paquete
mvn test -Dtest="edu.co.icesi.introspringboot.unit.*"
```
