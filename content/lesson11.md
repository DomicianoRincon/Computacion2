# Relación muchos a muchos

## Introducción a las Relaciones Muchos a Muchos

En JPA, una relación muchos a muchos (Many-to-Many) se utiliza para modelar una asociación en la que una instancia de una entidad puede estar relacionada con múltiples instancias de otra entidad, y viceversa. Por ejemplo, un estudiante puede inscribirse en muchos cursos, y un curso puede tener muchos estudiantes.

## El Problema con @ManyToMany

Aunque JPA proporciona la anotación `@ManyToMany` para simplificar las relaciones muchos a muchos, a menudo es mejor evitarla en aplicaciones complejas. La razón principal es que la tabla de unión es gestionada automáticamente por el proveedor de persistencia (por ejemplo, Hibernate), lo que dificulta la adición de columnas adicionales a esta tabla (por ejemplo, una fecha de inscripción, una calificación, etc.).
Una solución más flexible y potente es modelar la tabla de unión como una entidad propia. De esta manera, tenemos control total sobre ella.

## Modelando la Tabla de Unión como una Entidad

Para modelar la tabla de unión como una entidad, necesitamos:
1.  Una clase para representar la clave primaria compuesta de la tabla de unión. Esta clase se anotará con `@Embeddable`.
2.  La entidad de la tabla de unión, que utilizará la clave primaria compuesta a través de la anotación `@EmbeddedId`.
3.  Dos relaciones `@ManyToOne` desde la entidad de la tabla de unión hacia las dos entidades principales.
4.  Dos relaciones `@OneToMany` desde cada una de las entidades principales hacia la entidad de la tabla de unión.

## Ejemplo: Estudiantes y Cursos

Vamos a modelar una relación muchos a muchos entre las entidades `Student` y `Course`.

## La Clave Primaria Compuesta (`@Embeddable`)

Primero, creamos la clase para la clave primaria compuesta, `StudentCourseId`. Esta clase debe implementar `Serializable` y sobreescribir los métodos `hashCode()` y `equals()`.

```java
package com.example.myapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class StudentCourseId implements Serializable {

    @Column(name = "student_id")
    private Integer studentId;

    @Column(name = "course_id")
    private Integer courseId;

    // Constructores, getters y setters

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if(o instanceof StudentCourseId){
            StudentCourseId that = (StudentCourseId) o;
            return Objects.equals(studentId, that.studentId) && Objects.equals(courseId, that.courseId);
        }else return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, courseId);
    }
}
```

## La Entidad de la Tabla de Unión (`@EmbeddedId`)

Ahora, creamos la entidad `StudentCourse`, que representa la tabla de unión.

```java
package com.example.myapp.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "student_course")
public class StudentCourse {

    @EmbeddedId
    private StudentCourseId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "enrollment_date")
    private Date enrollmentDate;

    // Constructores, getters y setters
}
```

-   `@EmbeddedId`: Indica que la clave primaria es una clase embebida.

-   `@MapsId`: Se utiliza para mapear los campos de la clave primaria compuesta a las relaciones `@ManyToOne`. El valor de `@MapsId` debe coincidir con el nombre del campo en la clase `StudentCourseId`.

-   `fetch = FetchType.LAZY` se usa para que cuando se cargue la entidad, no cargue el objeto sino hasta que sea llamado

## 3. Actualizando las Entidades Principales

Finalmente, actualizamos las entidades `Student` y `Course` para que tengan una relación `@OneToMany` con `StudentCourse`.

```java
package com.example.myapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentCourse> courses;

    // Constructores, getters y setters
}
```

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

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentCourse> students;

    // Constructores, getters y setters
}
```

El `cascade = CascadeType.ALL` permite propagar las operaciones sobre alguna entidad al guardar, actualizar, eliminar y refrescar

`orphanRemoval = true` permite que no hayan registros huérfanos en la tabla intermedia.
