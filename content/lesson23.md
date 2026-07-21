# Spring Security

Spring Security es un framework de autenticación y autorización altamente personalizable para aplicaciones Java basadas en Spring. Proporciona mecanismos robustos para gestionar la seguridad, incluyendo autenticación de usuarios, control de acceso basado en roles, protección contra ataques como CSRF y session fixation, y compatibilidad con estándares como OAuth2 y JWT. Se integra fácilmente con Spring Boot y permite asegurar tanto aplicaciones web con Spring MVC y Thymeleaf como APIs REST.

## Setup

Para usar Spring Security debe añadir la dependencia de Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Trabajemos en el mismo repositorio que venimos manejando

```http
https://github.com/Domiciano/SpringMVC261
```

Al añadir la dependencia, verá que para acceder a sus controllers por medio de request desde el navegador, tendrá que `autenticarse` en la página.

## ¿Cómo o en dónde me autentico?

Al ejecutar la aplicación aparecerá algo como

```plain
Using generated security password: 0be98d58-3edd-49c4-b73a-e0a3fdda1809

This generated password is for development use only. Your security configuration must be updated before running your application in production.
```

Este es un usuario por defecto almacenado en memoria que usted debe/puede usar para obtener acceso a la página. Las credenciales son `user` y el password suministrado en la consola.

- Verifique en la consola del navegador la cookie que se crea

## Mecanismo de autenticación basada en estado

`1` Cuando un usuario intenta acceder a un recurso protegido en la aplicación (por ejemplo, http://localhost:8080/courses/), Spring Security intercepta la solicitud y detecta que no hay una sesión activa.

`2` Spring Security, por defecto, redirige al usuario a la página de inicio de sesión (/login).
El navegador recibe esta redirección y muestra la página de login.

`3` Cuando el usuario ingresa su usuario y contraseña y presiona "Iniciar sesión", el navegador envía una solicitud HTTP POST al servidor con las credenciales:

```plain
POST /login
Content-Type: application/x-www-form-urlencoded

username=user&password=3b4c1d2e-5f6g-7h8i-9j0k-l1m2n3o4p5q6
```

`4` Spring Security verifica las credenciales 

`5` Si son correctas, el servidor crea una nueva sesión HTTP y genera un JSESSIONID único para el usuario autenticado.

`6` Se devuelve la cookie JSESSIONID al cliente en la respuesta HTTP:

```plain
HTTP/1.1 200 OK
Set-Cookie: JSESSIONID=ABC123XYZ456; Path=/; HttpOnly; Secure
```

`7` A partir de este momento, cada vez que el usuario haga una nueva solicitud al servidor, el navegador enviará automáticamente la cookie JSESSIONID:

```plain
GET /admin
Cookie: JSESSIONID=ABC123XYZ456
```

Puede modificar el tiempo de sesión usando el `application.properties`

```ini
server.servlet.session.timeout=5m  # Expira en 5 minutos
```

## Modifiquemos el usuario (in-memory) por defecto

El siguiente paso será modificar el usuario por defecto. Nuestro camino es entender cómo funciona el `UserDetailsService` para mapear usuarios de Spring Security con usuarios almacenados en base de datos.

```java
@Configuration
public class WebSecurityConfig {
    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager userDetailsMngr = new InMemoryUserDetailsManager();

        UserDetails user = User.withUsername("miUsuario") // Cambiar el usuario
                .password("123456") // Especificar la contraseña
                .authorities("read") // Las authorities representan los roles o permisos que tiene el usuario
                .build();
        
        userDetailsMngr.createUser(user); // Agregar el usuario a la lista de usuarios

        return userDetailsMngr; // Retornar la lista de usuarios
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}
```

## Cargando usuario de DB

Ya hemos visto cómo se carga un in-memory user. Pero ahora, tenemos que llevar esta forma en la que funcionan los usuarios en SpringBoot para habilitar los usuarios almacenados en base de datos.

![Imagen](image15.png "icon")

Requerimos varios ingredientes

`Una tabla de Users`
Para poder disponer de usuarios registrador al momento de hacer login

`Repositorio+Service de Usuarios`
Para extraer información de la tabla de usuarios

`Servicio que implemente UserDetailsService`
UserDetailsService es una interfaz de Spring Security que carga los detalles de un usuario a partir de una fuente de datos para la autenticación. Nuestra fuente de datos en este casos será la base de datos.

`Clase que implemente UserDetails`
UserDetails representa la información del usuario autenticado, incluyendo su nombre, contraseña y roles. UserDetails es una interfaz de Spring Security.

## CustomUserDetailsService

Al implementar `UserDetailsService`, la clase nos pedirá que resolvamos la implementación de loadUserByUsername.

Para resolver este método, puede usar el servicio de `UserService` que es capaz de recuperar registros desde la base de datos.

Recordemos que aquí resolvemos la carga de datos a partir de una fuente de datos

```java
 @Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ?
    }
}
```

El método `loadUserByUsername(String username)` devuelve un objeto de tipo `UserDetails`. De modo que tenemos que crear una clase que implemente esa interfaz.

## SecurityUser

Tenemos que modelar el usuario autenticado. 

- `UserDetails` representa el usuario autenticado, que es diferente al usuario de base de datos.
- `User` representa el usuario extraído de la base de datos

Al implementar de `UserDetails`, tendremos que resolver los métodos `getUsername()`, `getPassword()` y `getAuthorities()`. Para los 2 primeros retornemos la información del usuario de base de datos. El último, en próximas clases lo usaremos para el tema de los permisos

```java
public class SecurityUser implements UserDetails {

    private User user;

    public SecurityUser(User user) {
        this.user = user;
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        return user.getPass();
    }

    @Override
    public List<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "read");
    }
}
```

## Método loadUserByUsername

Con todo listo, devolvámos una instancia de `UserDetails` a partir de un `username`. 

```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    ...
}
```

Use el `UserService` y cree un objeto de tipo `UserDetail` a partir del usuario recuperado de la base de datos.

## Request autorizadas

Una vez que estamos autorizados, el flujo se ve como en la imagen

![Imagen](image16.png "icon")

El request, ahora lleva la cookie `JSESSIONID`. Esta cookie es verificada por `SecurityContextPersistenceFilter`.

Si el request se mantiene, el filtro recupera la HTTPSession de Tomcat. Por debajo la HTTPSession tiene un objeto llamado `SecurityContext` que se carga en el `SecurityContextHolder`. Esto se mantiene almacenado de forma estática durante el proceso de request-response. Una vez ha terminado al transacción, se limpia el `SecurityContext`

Posteriomente, el `AuthorizationFilter` verifica permisos de esa sesión verificando si la ruta que se solicita en el `request` si es accesible por el usuario con la sesión identificada con `JSESSIONID`
