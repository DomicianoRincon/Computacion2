# Relaciones de tabla

También podemos relacionar tablas para generar un modelo de datos. El ejemplo inicial es hacer una relación 1 a muchos.

## Relación 1 a muchos

Por ejemplo vamos a adaptar la relación entre Profesores y Cursos. Un profesor puede dar varios cursos

```java
@Entity
@Table(name = "profesor")
public class Profesor {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private String name;
    @OneToMany(mappedBy = "profesor")
    private List<Curso> cursos;
    // Getters y Setters
}
```

```java
import jakarta.persistence.*;

@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private String name;
    private String program;
    @ManyToOne
    @JoinColumn(name = "profeID")
    Profesor profesor;
    // Getters y Setters
}
```

## Usando Docker para la base de datos

```yml
services:
  db:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_DB: 'db'
      POSTGRES_USER: 'user'
      POSTGRES_PASSWORD: 'password'
    ports:
      - '5432:5432'
    expose:
      - '5432'
    volumes:
      - my-volume:/var/lib/postgresql/data

volumes:
  my-volume:
```

Para crear el contenedor ejecuta:

```sh
docker-compose up -d
```
