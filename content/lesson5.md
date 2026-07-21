# Wiring de Beans e Inyección de Dependencias en Spring

## Inyección de dependencias

En Spring Boot, la inyección de dependencias es el mecanismo mediante el cual el framework administra y proporciona instancias de objetos (beans) a otras clases sin que estas tengan que crearlas manualmente. Este proceso, conocido como wiring de beans, permite definir cómo se relacionan y comunican los componentes dentro de la aplicación, asegurando un código más modular, reutilizable y fácil de mantener al reducir el acoplamiento entre las dependencias.

![Wiring de Beans](image8.png "icon")

## Capa Repository

La capa Repository es la encargada de acceder a los datos. Es la que se comunica con la base de datos, archivos o cualquier otro sistema de almacenamiento.
En este ejemplo, usaremos una lista en memoria en lugar de una base de datos real.
Más adelante, podríamos reemplazarla por JDBC, JPA o cualquier otro mecanismo sin cambiar la lógica de negocio.

💡 Es el `almacén` de la aplicación, donde se guardan y recuperan datos.

## Capa Service

La capa Service es la encargada de la lógica de negocio.
Actúa como un intermediario entre el controlador (Controller, Servlet) y la capa Repository.
Puede aplicar reglas de negocio antes de enviar los datos al Repository, como:
Validaciones de datos: Verificar que los datos cumplan ciertos criterios antes de guardarlos (por ejemplo, que un correo sea válido o que una cantidad no sea negativa). Transformación y normalización: Convertir datos a un formato adecuado antes de almacenarlos (por ejemplo, convertir textos a minúsculas o eliminar espacios en blanco).

- Lógica de negocio: Implementar reglas específicas del dominio, como restricciones de compra o cálculos de impuestos.
- Gestión de transacciones: Asegurar la consistencia de los datos mediante el manejo de transacciones.
- Llamadas a otros servicios: Integrar información de otras fuentes o microservicios antes de interactuar con la base de datos.

💡 Es el cerebro de la aplicación, que decide qué hacer antes de interactuar con los datos.

![Capas Service y Repository](image9.png "icon")

## Construyamos un ejemplo

Vamos a aplicar el wiring de beans para trabajar en una aplicación que gestione el registro de Estudiantes y sus Cursos.

```java
import java.util.List;

public class Student {

    private String code;
    //Example: A00123456

    private String name;

    private String program;

    private List<Course> courses;

    //Constructors

    //Getters y setters
    
}
```

```java
public class Course {
    
    private int id;
    //Example: 35

    private String name;
    
    private String professorName;
    
    private String schedule; 
    //Example: "MI 07:00 08:59, VI 15:00 16:59"

    //Constructors

    //Getters y setters

}
```

## 1. Creemos la capa de Repsository

Recordemos que la definición de las clases de la capa Repository hacen referencia a aquellas que nos dan acceso a datos. De momento no hemos visto persistencia de modo que simularemos el repository como un arreglo de elementos

```java
import java.util.ArrayList;
import java.util.List;

public class StudentRepository {
    private List<Student> students = new ArrayList<>();

    public List<Student> findAll() {
        return students;
    }

    public void save(Student student) {
        // Queremos que se guarde el estudiante en su repositorio y todos sus cursos en otro repositorio
        // Separe los elementos a la entrada y guarde casa objeto en su lugar
        // Aquí vamos a requerir el uso de CourseRepository.
    }
}
```

Podemos tener un Repository por entidad, faltaría el repository de cursos

```java
import java.util.ArrayList;
import java.util.List;

public class CourseRepository {
    private List<Course> courses = new ArrayList<>();

    public List<Course> findAll() {
        return courses;
    }

    public void save(Course course) {
        courses.add(course);
    }
}
```

Debemos tener un Repository por entidad, faltaría el repository de cursos

```java
import java.util.ArrayList;
import java.util.List;

public class CourseRepository {
    private List<Course> courses = new ArrayList<>();

    public List<Course> findAll() {
        return courses;
    }

    public void save(Course course) {
        courses.add(course);
    }
}
```

## 2. Creemos la capa de Service

Vamos a generar adicionalmente un bean de service que nos permite hacer lógica de negocio para garantizar condiciones de unicidad e integridad de los datos que se almacenan

Un service para Student

```java
import java.util.List;

public class StudentService {

    ...

}
```

Otro service para Course

```java
import java.util.List;

public class CourseService {

    ...

}
```

## 3. Hagamos el mise en place

```java
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--Repositorios-->
    <bean id="studentRepository" class="paquete.de.tu.proyecto.repositories.StudentRepository"/>

    <bean id="courseRepository" class="paquete.de.tu.proyecto.repositories.CourseRepository"/>

    <!--Service-->
    <bean id="studentService" class="paquete.de.tu.proyecto.services.StudentService"/>

    <bean id="courseService" class="paquete.de.tu.proyecto.services.CourseService"/>

</beans>
```

## 4. Debemos configurar esta disposición

La idea es generar los beans y posteriormente conectarlos

![Imagen](image7.png "icon")

En la imagen aparecen conexinones de bean. En este caso usamos la Agregación. En el ejemplo, supongamos que MiClaseB quiere usar los métodos de MiClaseA

```java
public class ClaseA{
    ...
}

public class ClaseB{
    private ClaseA objetoA;

    public ClaseB(ClaseA objetoA){
        this.objetoA = objetoA;
    }
}
```

En el XML puede crear los objeto y definir las dependencias

```java
<bean id="objetoA" class="ClaseA"/>

<bean id="objetoB" class="ClaseB">
    <constructor-arg ref="objetoA"/>
</bean>
```

## 4A. Alternativa: por medio de métodos

Es algo similar en donde también se usa la Agregación

```java
public class ClaseA {
    ...
}

public class ClaseB {
    private ClaseA objetoA;

    public void setObjetoA(ClaseA objetoA){
        this.objetoA = objetoA;
    }
}
```

En el XML ahora se inyecta por medio de `property`

```java
<bean id="objetoA" class="ClaseA"/>

<bean id="objetoB" class="ClaseB">
    <property name="objetoA" ref="objetoA"/>
</bean>
```

## Inicializar y destruir el bean

Puede ejecutar un método cuando crea un bean, por ejemplo, para establecer condiciones iniciales

```xml
<bean id="studentRepository"
      class="paquete.de.tu.proyecto.repositories.StudentRepository"
      init-method="init"
      destroy-method="cleanup"/>
```

El método debe crearlo como `public void`

```java
public class StudentRepository {

    private List<Student> students;

    public void init() {
        students = new ArrayList<>();
        System.out.println("StudentRepository inicializado correctamente");
    }

    public List<Student> findAll() {
        return students;
    }

    public void save(Student student) {
        students.add(student);
    }
}
```

Y también puede ejecutar código cuando se destruye el IoC container, por ejemplo cerrar conexiones

```java
public void cleanup() {
    System.out.println("Liberando recursos antes de destruir el bean");
}
```
