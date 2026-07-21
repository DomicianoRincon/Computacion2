# Query Methods en Spring Data JPA

[Spring Data JPA — Query Methods](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)

## ¿Qué son los Query Methods?

Spring Data JPA ofrece una funcionalidad poderosa llamada "Query Methods" (o métodos de consulta). Permite crear consultas a la base de datos de forma automática simplemente declarando métodos en tus interfaces de repositorio.

Spring analiza el nombre del método, lo divide en partes y lo traduce a una consulta JPQL (Java Persistence Query Language). Esto nos ahorra el trabajo de escribir consultas manualmente para la mayoría de los casos de uso comunes. La convención sigue el formato `findBy...`, `readBy...`, `countBy...`, y `getBy...`, seguido de las propiedades de la entidad.

## Preparando el Modelo

Para nuestros ejemplos, asumiremos que la entidad `Course` ha sido actualizada para incluir un campo `credits` y la relación con `Profesor` que vimos en lecciones anteriores. 

```java
package com.example.myapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    
    private int credits;

    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private Profesor profesor;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentCourse> students;

    // Constructores, getters y setters
}
```

## Ejemplos Básicos

Vamos a añadir algunos métodos a nuestro `CourseRepository`.

```java
package com.example.myapp.repository;

import com.example.myapp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Encuentra cursos por su nombre exacto
    List<Course> findByName(String name);

    // Encuentra cursos cuyo nombre contenga una cadena, ignorando mayúsculas/minúsculas
    List<Course> findByNameContainingIgnoreCase(String keyword);

    // Encuentra cursos con un número de créditos mayor que el valor proporcionado
    List<Course> findByCreditsGreaterThan(int credits);
}
```

## Consultas a través de Relaciones

La verdadera potencia de los Query Methods se ve cuando navegamos a través de las relaciones entre entidades. Spring Data JPA se encarga de generar los `JOIN` necesarios automáticamente.

## 1. Encontrar Cursos por el Nombre del Profesor

Podemos encontrar todos los cursos impartidos por un profesor específico sin necesidad de tocar el `ProfesorRepository`.

```java
// En CourseRepository
List<Course> findByProfesorName(String professorName);
```

Spring entiende que debe navegar desde `Course` a la entidad `Profesor` (`findByProfesor...`) y luego filtrar por la propiedad `name` de esa entidad (`...Name`).

## 2. Contar Cursos de un Profesor

De manera similar, podemos contar cuántos cursos tiene asignados un profesor.

```java
// En CourseRepository
long countByProfesorName(String professorName);
```

## 3. Encontrar Estudiantes por Curso

Gracias a nuestra estructura de entidades, podemos hacer una consulta muy potente para encontrar todos los estudiantes inscritos en un curso con un nombre específico. ¡Esto lo hacemos directamente desde el `StudentRepository`!

```java
package com.example.myapp.repository;

import com.example.myapp.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Encuentra estudiantes inscritos en un curso con un nombre específico
    List<Student> findByStudentCourses_Course_Name(String courseName);
}
```

Aquí, Spring navega `Student` -> `studentCourses` (la lista de `StudentCourse`) -> `course` (la entidad `Course` dentro de `StudentCourse`) -> `name` (el nombre del `Course`).

## Datos de Prueba

Para que los siguientes ejercicios vamos a engrosar un poco nuestros `data.sql`

```sql
-- Insertar 5 Profesores
INSERT INTO professors (name) VALUES ('Juan Perez'), ('Maria Rodriguez'), ('Carlos Gomez'), ('Ana Martinez'), ('Luis Hernandez');

-- Insertar 8 Cursos (algunos profesores tienen más de un curso)
INSERT INTO courses (name, credits, professor_id) VALUES ('Introduccion a la Programacion', 4, 1);
INSERT INTO courses (name, credits, professor_id) VALUES ('Estructuras de Datos', 4, 1);
INSERT INTO courses (name, credits, professor_id) VALUES ('Anatomia Humana', 5, 2);
INSERT INTO courses (name, credits, professor_id) VALUES ('Fisiologia', 5, 2);
INSERT INTO courses (name, credits, professor_id) VALUES ('Derecho Penal', 3, 3);
INSERT INTO courses (name, credits, professor_id) VALUES ('Derecho Civil', 3, 3);
INSERT INTO courses (name, credits, professor_id) VALUES ('Dibujo Tecnico', 2, 4);
INSERT INTO courses (name, credits, professor_id) VALUES ('Historia del Arte', 3, 5);

-- Insertar 7 Estudiantes
INSERT INTO students (name, code, program) VALUES ('Laura Garcia', '2021102001', 'Ingenieria de Sistemas');
INSERT INTO students (name, code, program) VALUES ('Pedro Pascal', '2021102006', 'Ingenieria de Sistemas');
INSERT INTO students (name, code, program) VALUES ('Andres Lopez', '2021102002', 'Medicina');
INSERT INTO students (name, code, program) VALUES ('Sofia Torres', '2021102003', 'Derecho');
INSERT INTO students (name, code, program) VALUES ('David Ramirez', '2021102004', 'Arquitectura');
INSERT INTO students (name, code, program) VALUES ('Valentina Diaz', '2021102005', 'Diseno Grafico');
INSERT INTO students (name, code, program) VALUES ('Camila Velez', '2022102007', 'Medicina');

-- Insertar relaciones Estudiante-Curso complejas
INSERT INTO students_courses (student_id, course_id) VALUES (1, 1), (1, 2); -- Laura (Sistemas) en 2 cursos de Sistemas
INSERT INTO students_courses (student_id, course_id) VALUES (2, 1); -- Pedro (Sistemas) en 1 curso de Sistemas
INSERT INTO students_courses (student_id, course_id) VALUES (3, 3), (3, 4); -- Andres (Medicina) en 2 cursos de Medicina
INSERT INTO students_courses (student_id, course_id) VALUES (4, 5), (4, 8); -- Sofia (Derecho) en Derecho Penal e Historia del Arte
INSERT INTO students_courses (student_id, course_id) VALUES (5, 7); -- David (Arquitectura) en Dibujo Tecnico
INSERT INTO students_courses (student_id, course_id) VALUES (6, 8); -- Valentina (Diseño) en Historia del Arte
INSERT INTO students_courses (student_id, course_id) VALUES (7, 3); -- Camila (Medicina) en Anatomia
```

# Tarea 2

Ahora es tu turno. Añade los siguientes métodos a los repositorios correspondientes y pruébalos.

1.  En `StudentRepository`
Encuentra un estudiante por su código único.

2.  En `ProfessorRepository`
Encuentra profesores cuyo nombre contenga una cadena de texto (ignorando mayúsculas y minúsculas).

3.  En `CourseRepository`
Encuentra todos los cursos que tengan un número específico de créditos.

4.  En `StudentRepository`
Encuentra todos los estudiantes de un programa académico.

5.  En `CourseRepository`
Encuentra un curso por su nombre exacto, ignorando mayúsculas y minúsculas.

6.  En `CourseRepository`
Encuentra todos los cursos impartidos por un profesor específico (por su nombre) y ordénalos alfabéticamente.

7.  En `StudentRepository`
Encuentra todos los estudiantes de un programa específico cuyo código empiece por un prefijo determinado.

8.  En `CourseRepository`
Encuentra todos los cursos cuyo número de créditos se encuentre en un rango (por ejemplo, entre 3 y 4 créditos).

9.  En `StudentRepository`
Encuentra todos los estudiantes que están viendo cursos con un profesor específico (por el nombre del profesor). Esta consulta debe navegar `Student` → `StudentCourse` → `Course` → `Professor`.

10.  En `ProfessorRepository`: Encuentra todos los profesores (sin duplicados) que le enseñan a estudiantes de un programa académico específico. Esta es la más compleja, navegando `Professor` → `Course` → `StudentCourse` → `Student`.

Habilite esta bandera para ver la operación SQL subyacente

```ini
spring.jpa.show-sql=true
```
