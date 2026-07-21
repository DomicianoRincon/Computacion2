# Spring Data JPA: Paginación, Orden y Más

## Introducción

En la lección anterior, exploramos cómo crear consultas complejas basadas en los nombres de los métodos. Ahora, vamos a profundizar en funcionalidades más avanzadas que nos permitirán controlar la cantidad de resultados, el orden y cómo obtenerlos en "páginas".

## Limitando Resultados con `First` y `Top`

A veces, no necesitas todos los resultados que coinciden con una consulta, sino solo el primero o un número específico de ellos. Spring Data JPA lo hace muy fácil con las palabras clave `First` y `Top`.

```java
package com.example.myapp.repository;

import com.example.myapp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Obtiene el primer curso que encuentra ordenado por nombre ascendente
    Optional<Course> findFirstByOrderByNameAsc();

    // Obtiene los 2 cursos con más créditos
    List<Course> findTop2ByOrderByCreditsDesc();

    // Obtiene los 3 cursos del profesor "Juan Perez"
    List<Course> findFirst1ByProfessor_Name(String professorName);
}
```

*   `findFirst...`: Devuelve un solo objeto, idealmente envuelto en un `Optional`.
*   `findTopN...`: Devuelve una `List` con un máximo de `N` resultados.
Basado en nuestro `data.sql`, `findTop2ByOrderByCreditsDesc()` devolvería "Anatomia Humana" y "Fisiologia", ambos con 5 créditos.

## Consultas de Rango con `Between`

Ya lo vimos brevemente en los ejercicios, pero `Between` es muy útil para buscar dentro de un rango, aplicable a números, fechas y cadenas.

```java
// En CourseRepository
// Encuentra cursos cuyos créditos estén entre 3 y 4
List<Course> findByCreditsBetween(int minCredits, int maxCredits);
```

Al llamar a `courseRepository.findByCreditsBetween(3, 4)`, obtendríamos una lista de cursos que incluye "Derecho Penal", "Derecho Civil", "Historia del Arte", "Introducción a la Programación" y "Estructuras de Datos".

## Ordenamiento Explícito con `OrderBy`

Aunque `First` y `Top` a menudo se combinan con `OrderBy`, esta última se puede usar de forma independiente para garantizar que los resultados de cualquier consulta vengan en un orden predecible.

```java
// En CourseRepository

// Encuentra todos los cursos de un profesor, ordenados por nombre del curso de forma descendente
List<Course> findByProfesorNameOrderByNameDesc(String professorName);

// Encuentra todos los cursos con 4 créditos, ordenados por nombre ascendente
List<Course> findByCreditsOrderByNameAsc(int credits);
```

## Paginación con `Pageable`

Para aplicaciones reales, devolver cientos o miles de resultados en una sola consulta es ineficiente y poco práctico. La solución es la paginación: devolver un subconjunto de resultados (una "página") a la vez. Spring Data JPA lo integra de manera brillante a través de la interfaz `Pageable`.

## 1. Modificar el Repositorio

Para habilitar la paginación, simplemente añade un parámetro de tipo `Pageable` al final de tu método de consulta. El tipo de retorno debe cambiar de `List<T>` a `Page<T>`.

```java
package com.example.myapp.repository;

import com.example.myapp.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Encuentra todos los cursos de un programa y devuelve los resultados paginados
    Page<Course> findByProfesorName(String professorName, Pageable pageable);
}
```

El objeto `Page` no solo contiene la lista de cursos para la página solicitada, sino también información total sobre la consulta: número total de elementos, número total de páginas, si es la primera o la última página, etc.

## 2. Solicitar una Página

En tu servicio o controlador, ahora puedes solicitar una página específica de datos. Para ello, se crea una instancia de `Pageable` usando `PageRequest.of()`.

```java
package com.example.myapp.services;

import com.example.myapp.model.Course;
import com.example.myapp.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Page<Course> getCoursesByProfessor(String professorName, int page, int size) {
        // Crea un objeto Pageable para solicitar una página específica.
        // page: número de la página (base 0)
        // size: tamaño de la página
        Pageable pageable = PageRequest.of(page, size);
        return courseRepository.findByProfesorName(professorName, pageable);
    }
}
```

## 3. Exponerlo en un Controlador

Un controlador podría recibir los parámetros de página y tamaño desde la URL.

```java
package com.example.myapp.controllers;

import com.example.myapp.model.Course;
import com.example.myapp.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/courses/by-professor")
    public Page<Course> getCourses() {
        return courseService.getCoursesByProfessor("Juan Perez", 0, 3);
    }
}
```

## Recursos

El siguiente `data.sql` tiene 50 cursos distribuidos entre 10 profesores. Úsalo para tener suficientes datos y poder ver la paginación en acción.

```sql
-- 10 Profesores
INSERT INTO professor (name) VALUES ('Juan Perez');
INSERT INTO professor (name) VALUES ('Maria Rodriguez');
INSERT INTO professor (name) VALUES ('Carlos Gomez');
INSERT INTO professor (name) VALUES ('Ana Martinez');
INSERT INTO professor (name) VALUES ('Luis Hernandez');
INSERT INTO professor (name) VALUES ('Pedro Sanchez');
INSERT INTO professor (name) VALUES ('Rosa Moreno');
INSERT INTO professor (name) VALUES ('Jorge Castillo');
INSERT INTO professor (name) VALUES ('Elena Vargas');
INSERT INTO professor (name) VALUES ('Miguel Torres');

-- 50 Cursos
-- Juan Perez (Sistemas)
INSERT INTO course (name, credits, professor_id) VALUES ('Introduccion a la Programacion', 4, 1);
INSERT INTO course (name, credits, professor_id) VALUES ('Estructuras de Datos', 4, 1);
INSERT INTO course (name, credits, professor_id) VALUES ('Algoritmos y Complejidad', 4, 1);
INSERT INTO course (name, credits, professor_id) VALUES ('Base de Datos', 3, 1);
INSERT INTO course (name, credits, professor_id) VALUES ('Redes de Computadores', 3, 1);

-- Maria Rodriguez (Medicina)
INSERT INTO course (name, credits, professor_id) VALUES ('Anatomia Humana', 5, 2);
INSERT INTO course (name, credits, professor_id) VALUES ('Fisiologia', 5, 2);
INSERT INTO course (name, credits, professor_id) VALUES ('Bioquimica Medica', 4, 2);
INSERT INTO course (name, credits, professor_id) VALUES ('Farmacologia', 4, 2);
INSERT INTO course (name, credits, professor_id) VALUES ('Patologia General', 5, 2);

-- Carlos Gomez (Derecho)
INSERT INTO course (name, credits, professor_id) VALUES ('Derecho Penal', 3, 3);
INSERT INTO course (name, credits, professor_id) VALUES ('Derecho Civil', 3, 3);
INSERT INTO course (name, credits, professor_id) VALUES ('Derecho Constitucional', 3, 3);
INSERT INTO course (name, credits, professor_id) VALUES ('Derecho Laboral', 3, 3);
INSERT INTO course (name, credits, professor_id) VALUES ('Derecho Internacional', 2, 3);

-- Ana Martinez (Arquitectura)
INSERT INTO course (name, credits, professor_id) VALUES ('Dibujo Tecnico', 2, 4);
INSERT INTO course (name, credits, professor_id) VALUES ('Diseno Arquitectonico I', 4, 4);
INSERT INTO course (name, credits, professor_id) VALUES ('Diseno Arquitectonico II', 4, 4);
INSERT INTO course (name, credits, professor_id) VALUES ('Historia de la Arquitectura', 3, 4);
INSERT INTO course (name, credits, professor_id) VALUES ('Materiales de Construccion', 3, 4);

-- Luis Hernandez (Historia y Arte)
INSERT INTO course (name, credits, professor_id) VALUES ('Historia del Arte', 3, 5);
INSERT INTO course (name, credits, professor_id) VALUES ('Historia Universal', 3, 5);
INSERT INTO course (name, credits, professor_id) VALUES ('Historia de Colombia', 3, 5);
INSERT INTO course (name, credits, professor_id) VALUES ('Filosofia Moderna', 2, 5);
INSERT INTO course (name, credits, professor_id) VALUES ('Etica y Sociedad', 2, 5);

-- Pedro Sanchez (Matematicas)
INSERT INTO course (name, credits, professor_id) VALUES ('Calculo Diferencial', 4, 6);
INSERT INTO course (name, credits, professor_id) VALUES ('Calculo Integral', 4, 6);
INSERT INTO course (name, credits, professor_id) VALUES ('Algebra Lineal', 4, 6);
INSERT INTO course (name, credits, professor_id) VALUES ('Ecuaciones Diferenciales', 3, 6);
INSERT INTO course (name, credits, professor_id) VALUES ('Estadistica y Probabilidad', 3, 6);

-- Rosa Moreno (Fisica)
INSERT INTO course (name, credits, professor_id) VALUES ('Fisica Mecanica', 4, 7);
INSERT INTO course (name, credits, professor_id) VALUES ('Fisica Electromagnetismo', 4, 7);
INSERT INTO course (name, credits, professor_id) VALUES ('Fisica Moderna', 3, 7);
INSERT INTO course (name, credits, professor_id) VALUES ('Laboratorio de Fisica I', 2, 7);
INSERT INTO course (name, credits, professor_id) VALUES ('Laboratorio de Fisica II', 2, 7);

-- Jorge Castillo (Quimica)
INSERT INTO course (name, credits, professor_id) VALUES ('Quimica General', 4, 8);
INSERT INTO course (name, credits, professor_id) VALUES ('Quimica Organica', 4, 8);
INSERT INTO course (name, credits, professor_id) VALUES ('Quimica Analitica', 3, 8);
INSERT INTO course (name, credits, professor_id) VALUES ('Laboratorio de Quimica', 2, 8);
INSERT INTO course (name, credits, professor_id) VALUES ('Quimica Ambiental', 3, 8);

-- Elena Vargas (Biologia)
INSERT INTO course (name, credits, professor_id) VALUES ('Biologia Celular', 4, 9);
INSERT INTO course (name, credits, professor_id) VALUES ('Genetica', 4, 9);
INSERT INTO course (name, credits, professor_id) VALUES ('Microbiologia', 3, 9);
INSERT INTO course (name, credits, professor_id) VALUES ('Ecologia', 3, 9);
INSERT INTO course (name, credits, professor_id) VALUES ('Botanica', 3, 9);

-- Miguel Torres (Economia)
INSERT INTO course (name, credits, professor_id) VALUES ('Microeconomia', 3, 10);
INSERT INTO course (name, credits, professor_id) VALUES ('Macroeconomia', 3, 10);
INSERT INTO course (name, credits, professor_id) VALUES ('Economia Internacional', 3, 10);
INSERT INTO course (name, credits, professor_id) VALUES ('Finanzas Corporativas', 4, 10);
INSERT INTO course (name, credits, professor_id) VALUES ('Contabilidad General', 3, 10);
```
