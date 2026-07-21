# Autenticación y Autorización

La autenticación es el proceso mediante el cual el sistema verifica la identidad de un usuario, servicio o dispositivo, normalmente a través de credenciales como contraseñas, tokens, certificados o datos biométricos, asegurándose de que quien intenta acceder es realmente quien dice ser. 

La autorización, en cambio, ocurre después de la autenticación y consiste en determinar qué acciones, recursos o información tiene permitido usar ese usuario dentro del sistema, según los roles, permisos o políticas asignadas. En conjunto, autenticación responde a la pregunta “¿quién sos?”, mientras que autorización responde a “¿qué podés hacer?”.

## Registro de usuarios

Para dar de alta a un usuario, debemos insertar el registro en la tabla `User`. Para lograrlo, grosso modo, hay que elaborar una plantilla `signup.html`con Thymeleaf para dar de alta al usuario. Luego, definir la ruta `/signup` como pública para permitir a un usuario registrarse.

En Service desarrolle un método de almacenamiento del usario donde guarde la constraseña hasheada. No la contraseña legible. Vamos entonces a definir un `BCryptPasswordEncoder` como `PasswordEncoder`.

```java
@Configuration
public class WebSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}
```

`BCrypt` es un algoritmo de hashing. 

## SecurityFilterChain

Como sabe, cuando usamos Spring Boot Security, por defecto todas la rutas de la applicación web estarán protegidas de modo que solo clientes autenticado podrán hacer request.

Esto lo podemos cambiar por medio de un `SecurityFilterChain`.

```java
@Configuration 
@EnableWebSecurity
public class WebSecurityConfig {
    ...

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(
                auth -> auth
                    .requestMatchers("/public/**").permitAll() 
                    .anyRequest().authenticated() 
            );
            return http.build();
    }
    ...
}
```

Observe que usamos el método `authorizeHttpRequest` que recibe un lambda. Este nos permite definir qué rutas son públicas (por medio de `permitAll()`) y qué rutas requieren autenticación (por medio de `authenticated()`).

Podemos definir `signup` como ruta publica con `requestMatchers("/signup")`

Adicionalmente si requiere varios securityFilterChain, por ejemplo, uno para la consola H2 y otro para el resto de la aplicación, use los órdenes

```java
@Configuration @EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    @Order(1)
    public SecurityFilterChain h2SecurityFilterChain(HttpSecurity http) throws Exception {
        ...
    }

    @Bean
    @Order(2)
    public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        ...
    }
}
```

En este caso requerimos que todas las rutas que dependen de h2 tengan acceso sin la autenticación propia de la aplicación. Cuando queremos referenciar a un conjunto de request y no a toda la aplicación, podemos usar `requestMatchers`

```java
@Bean
@Order(1)
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher(toH2Console())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(toH2Console()).permitAll()
        )
        .csrf(csrf -> csrf
            .ignoringRequestMatchers(toH2Console())
        )
        .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin())
        );
        return http.build();
}
```

En este caso `toH2Console()` devuelve la ruta configurada hacia la consola de h2

Finalmente, usted puede ofrecer al usuario un login por defecto usando en la últmo filterchain usando el método .withDefaults().

```java
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(
                    auth -> auth
                                .requestMatchers("/public/**").permitAll()
                                .anyRequest().authenticated()
            ).formLogin(Customizer.withDefaults()); //<--- Quítelo y observe qué pasa
        return http.build();
}
```

## Permitiendo registro público

Ya que conoce lo escencial de las reglas de seguridad, aplique una regla que de acceso libre a su ruta de registro.

Una vez conseguido, almacene el usuario, pero con contraseña hasheada

## Información de prueba

Vamos a actualizar los 2 usuarios con contraseña `123456` usando `BCrypt`.

```sql
-- Insertar usuarios
INSERT INTO users (id, email, password)
VALUES (estudiante@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506'),
       ('profesor@gmail.com', '$2a$12$LE5wWF2zJKLfE98E4KgJPO.buVfS0xHlSg2F2ciQMnk5kdgEBx506');
```

## Login personalizado

Si usted piensa "Qué login tan feo el que da springboot", este apartado es para usted. Cree un plantilla de `login.html`.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .formLogin(login -> login
                .loginPage("/auth/login")
                .defaultSuccessUrl("/home", true)
                .permitAll()
            );
        return http.build();
    }
}
```

En este caso se utiliza `formLogin` que recibe un lambda. Este permite definir la `loginPage`, la `defaultSuccessUrl` y definir si es público por medio de `permitAll`.

En el caso de `defaultSuccessUrl` la bandera en true permite que siempre redirija a `/home` sin importar la ruta a la que inicialmente se dirigía el usuario.

Su login debe tener al menos este form

```html
<form th:action="@{/auth/login}" method="post">
    <input type="text" id="username" name="username" required>
    <input type="password" id="password" name="password" required>
    <button type="submit">Ingresar</button>

    <div th:if="${param.error}">
        <p style="color: red;">Usuario o contraseña incorrectos</p>
    </div>

    <div th:if="${param.logout}">
        <p style="color: green;">Has cerrado sesión correctamente</p>
    </div>
</form>
```

Note que se nombran las variables `username` y `password`. Además se accede a variables de Request Param como `error` y `logout` en caso de username o password incorrectos y cierre de sesión respectivamente.

## Acceder a mis propios detalles

Podemos acceder a los detalles del usuario autenticado a través del objeto autentication.

```java
@GetMapping("/profile")
public String profile(Model model, Authentication authentication) {
    // authentication viene inyectado por Spring
    CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
    model.addAttribute("username", user.getUsername());
    model.addAttribute("authorities", user.getAuthorities());
    return "auth/profile";
}
```

A partir de esto, usted puede usar el nombre o authorities para rederizarlo en la aplicación

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Perfil</title>
</head>
<body>
<h1>Perfil del Usuario</h1>
<p>Username: <span th:text="${username}"></span></p>
<p>Authorities:</p>
<ul>
    <li th:each="auth : ${authorities}"
        th:text="${auth.authority}"></li>
</ul>
</body>
</html>
```

Tambien podemos interactuar con los elementos de autenticación por medio de acceso estático

```java
@GetMapping("/profile")
public String profile() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
}
```

O si solo necesito el UserDetails

```java
@GetMapping("/profile")
public String profile(@AuthenticationPrincipal CustomUserDetails user) {
    String username = user.getUsername();
}
```

.
