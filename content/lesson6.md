# Formas de definir un context

De momento sabemos crear la estructura del software por medio de una arquitectura basada en tres capas. Vamos a ver cómo le podemos dar información inicial a un contexto, por ejemplo, si necesitamos condiciones iniciales.

## Inicializar

Vamos a hacer uso de métodos de inicialización

```java
<bean id="objetoA" class="MiClaseA" init-method="initializeBean">
    ...
</bean>
```

Aquí se ejecuta el método `initializeBean()` luego de que Spring Framework instancia los beans y hace el wiring

![Imagen](https://miro.medium.com/v2/0*_D0yYUddRl-BOLiq "icon")

Debes crear la siguiente información inicial. Puede usar un método GET de alguno de los Servlet/JSP para verificar si efectivamente esta información fue almacenada

```plain
Cursos
        Curso 1:
            10001
            Computación en Internet 2
            Kevin Rodriguez        
        Curso 2:
            10002
            Psicología Clínica
            Yamileth Bolaños
        Curso 3:
            10003
            Matemáticas Aplicadas II
            Marlon Gómez

Estudiantes
    Estudiante 1:
        A00111111
        Andrea Gutiérrez
        Ingeniería de Sistemas
        Cursos:
            Curso 1:
                10003
            Curso 2:
                10001
    Estudiante 2
        A00333333
        Carlos Zapata
        Cursos:
            Curso 1:
                10001
            Curso 2:
                10002
```

## Versiones del proyecto

Tenemos este esquema y basado en esto, vamos a ver otras formas de especificar un contexto de Spring.

![Esquema de capas Service y Repository](image10.png "icon")

## Definición de Beans con @Bean

Usando las anotaciones `@Configuration` y `@Bean`, podemos especificar beans y sus conexiones. Por ejemplo

```java
@Configuration
public class AppConfig {
    @Bean("miBean")
    @Scope("singleton") 
    public MiClase miObjeto() {
        return new MiClase();
    }
}
```

Si quieremos conectar los beans basta con usar métodos y usar las dependencias sobre los constructores

```java
@Configuration
public class AppConfig {
    @Bean
    public StudentRepository studentRepository() {
        return new StudentRepository();
    }
    @Bean
    public StudentService studentService(StudentRepository studentRepository) {
        return new StudentService(studentRepository);
    }
}
```

Finalmente cambiemos el conexto de la aplicación

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    private static final ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
    public static ApplicationContext getContext() {
        return context;
    }
}
```

Puede especificar un `initMethod` para que cuando el bean se construya, se puedan ejecutar acciones

```java
@Bean(initMethod="intialize")
public StudentRepository studentRepository() {
    return new StudentRepository();
}
```

## Definición de Beans con `@Component`

Puedes usar la anotación `@Component` sobre la clase para definir un bean. Existen alias como `@Service` y `@Repository` para mayor semántica.

```java
@Component
public class MiClaseA {}
```

```java
@Repository
public class CourseRepository {}
```

```java
@Service
public class CourseService {}
```

La conexión de beans sucede de forma automática siempre que se declaren correctamento los constructores

```java
@Repository
public class CourseRepository {}

@Service
public class CourseService{
    private final CourseRepository courseRepository;
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
}
```

Aunque en el curso preferiré hacerlo de la siguiente manera

```java
@Repository
public class CourseRepository {
    ...
}

@Service
public class CourseService{
    @Autowired
    private CourseRepository courseRepository;
}
```

## Inicialización con @PostConstruct

Puede poner condiciones iniciales, puede usar la anotación `@PostConstruct`. Para usarlo necesitará la dependencia

```xml
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
```

De aquí en adelante, cualquier método que marque con `@PostConstruct` se ejecutará una vez construido el bean.

```java
@PostConstruct
public void initializeData(){
    // Código de inicialización
}
```

## @ComponentScan

La anotación `@ComponentScan` se utiliza en Spring para escanear automáticamente componentes (clases anotadas con `@Component`, `@Service`, `@Repository`, `@Controller`, etc.) dentro de un paquete base y registrarlos como beans en el contexto de la aplicación. Esto elimina la necesidad de declarar explícitamente cada bean en la configuración XML o Java.

Ejemplo de uso:

```java
@Configuration
@ComponentScan(basePackages = "com.example.myapp")
public class AppConfig {
    // ...
}
```

Para escanear múltiples paquetes, puedes especificar un array de strings:

```java
@Configuration
@ComponentScan(basePackages = {"com.example.service", "com.example.repository"})
public class AppConfig {
    // ...
}
```
