# Autorización

## Usando el rol

Usted puede devolver la lista de autorities basado en el rol del usuario

```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getUserRoles().stream()
        .map(userRole -> new SimpleGrantedAuthority(userRole.getRole().getName()))
        .collect(Collectors.toList());
}
```

Luego, puede usar una regla especifica de acceso

```java
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/auth/signup", "/auth/register").permitAll()
                                .requestMatchers("/students/**").hasRole("PROFESSOR") //<-- Aqui uso el rol
                                .anyRequest().authenticated()
                ).formLogin(Customizer.withDefaults());
        return http.build();
}
```

Note que usamos `PROFESSOR` y no `ROLE_PROFESSOR`.

## Usando el permiso

Además de los roles, podemos afinar aún más la seguridad usando permisos. Un permiso representa una acción específica (por ejemplo, `VIEW_COURSES` o `EDIT_COURSES`) que puede ser asignada a un rol y, por ende, a un usuario.

Para integrarlo en Spring Security, debes mapear los permisos como GrantedAuthority en tu UserDetails personalizado:

```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {    
    List<Role> rolesOfUser = user.getUserRoles().stream()
        .map(userRole -> userRole.getRole())
        .toList();
    
    List<Permission> permissionsOfUser = rolesOfUser.stream()
        .flatMap(role -> role.getRolePermissions().stream())
        .map(rolePermission -> rolePermission.getPermission())
        .toList();
    
    List<SimpleGrantedAuthority> permissionAuthorities = permissionsOfUser.stream()
        .map(permission -> new SimpleGrantedAuthority(permission.getName()))
        .toList();

    List<SimpleGrantedAuthority> roleAuthorities = rolesOfUser.stream()
        .map(role -> new SimpleGrantedAuthority(role.getName()))
        .toList();

    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
    authorities.addAll(permissionAuthorities);
    authorities.addAll(roleAuthorities);

    return authorities;
}
```

De esta forma, si un profesor tiene el permiso `EDIT_COURSES`, su GrantedAuthority incluirá `EDIT_COURSES`.

Luego puedes usarlo en tu SecurityFilterChain con hasAuthority:

```java
@Bean
@Order(2)
public SecurityFilterChain appSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(
            auth -> auth
                .requestMatchers("/auth/signup", "/auth/register").permitAll()
                .requestMatchers("/courses/").hasAuthority("VIEW_COURSES") //<-- Aquí uso el permiso
                .requestMatchers("/courses/edit/").hasAuthority("EDIT_COURSES")
                .anyRequest().authenticated()
        ).formLogin(Customizer.withDefaults());
    return http.build();
}
```

Con esto, el acceso ya no depende únicamente del rol general (ej. ROLE_PROFESSOR), sino de las acciones concretas (`VIEW_COURSES`, `EDIT_COURSES`, etc.), lo que da un control más granular.

## Manejar el logout

Para hacer el logout podemos hacer un POST request a `/logout`. Podemos configurar que elimine la HTTP Session y la cookie.

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/auth/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );
        return http.build();
    }
}
```

Note que una vez que hacemos logout, enviamos al usuario a `login?logout`. En este caso `logout` es una Query Param llamada `logout` cuyo valor es `true`, es una variable boolean.
