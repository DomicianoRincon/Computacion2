# Spring Boot

## ¿Qué es Spring Boot?

Spring Boot es una extensión de Spring Framework que simplifica la creación de aplicaciones Spring al eliminar la configuración manual extensa. Proporciona configuraciones automáticas, un servidor embebido y convenciones predeterminadas para acelerar el desarrollo, manteniendo la flexibilidad y potencia de Spring.

## Creación del primer proyecto

Puede usar el wizard online de `Spring Initilizr` 

[Spring-boot Wizard](https://start.spring.io/)

O también lo puede hacer con IntelliJ. Cree un nuevo proyecto:

![Creación de proyecto Spring Boot en IntelliJ](image11.png "icon")

Use Maven en la sección de type:

![Selección de Maven para el proyecto](image12.png "icon")

Puede agregar las dependencias importantes aqui o hacerlo manualmente en el `pom.xml`.

## Clase principal y anotaciones

En la clase principal puede ver la anotación `@SpringBootApplication`, que combina `@SpringBootConfiguration`, `@EnableAutoConfiguration` y `@ComponentScan`.

- `@SpringBootConfiguration`: Indica que la clase es una fuente de configuración para la aplicación (similar a @Configuration en Spring).
- `@EnableAutoConfiguration`: Activa la configuración automática basada en las dependencias presentes en el classpath.
- `@ComponentScan`: Escanea los beans presentes en el paquete principal y los crea.

```java
@SpringBootApplication
public class IntroSpringApplication {
    public static void main(String[] args) {
        SpringApplication.run(IntroSpringApplication.class, args);
    }
}
```

Puede usar `@PostConstruct` en esta clase para inicializar la aplicación:

```java
@SpringBootApplication
public class IntroSpringApplication {
    public static void main(String[] args) {
        SpringApplication.run(IntroSpringApplication.class, args);
    }
    @PostConstruct
    public void init() {
        // Código de inicialización
    }
}
```

La configuración del proyecto se hace por medio del archivo `application.properties`. Por ejemplo, puede cambiar el puerto donde escucha la apliación usando

```ini
server.port=8081
```
