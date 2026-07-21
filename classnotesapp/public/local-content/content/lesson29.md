# Auth en REST

Ya sabemos que la diferencia entre REST y RESTful radica principalmente en el uso del término: REST (Representational State Transfer) es un conjunto de principios arquitectónicos definidos por Roy Fielding para diseñar servicios web escalables y mantenibles, mientras que RESTful se refiere a aquellos servicios web que siguen correctamente los principios REST. Es decir, un servicio puede llamarse RESTful solo si implementa de forma adecuada aspectos como el uso de métodos HTTP correctos (GET, POST, PUT, DELETE), URIs bien estructurados, comunicación sin estado (stateless) y respuestas basadas en recursos. En resumen, REST es la teoría, y RESTful es la práctica bien aplicada de esa teoría.

Vamos ahora a hacer una autenticación RESTful. Para este caso los endpoints, al ser especiales, no sigue la convención de sustantivos. Por ejemplo el endpoint de login será `/login`

El mecanismo es como se ilustra a continuación

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="415" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="ao-jwt1" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#FFA726"/>
    </marker>
    <marker id="ag-jwt1" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0,8 3,0 6" fill="#66BB6A"/>
    </marker>
  </defs>
  <rect width="680" height="415" fill="#12121f" rx="12"/>
  <text x="340" y="30" text-anchor="middle" fill="#e0e0e0" font-size="15" font-weight="bold">Flujo de Autenticacion con Token JWT</text>
  <rect x="20" y="50" width="120" height="38" rx="8" fill="#1565C0"/>
  <text x="80" y="73" text-anchor="middle" fill="white" font-weight="bold" font-size="13">Cliente</text>
  <rect x="540" y="50" width="120" height="38" rx="8" fill="#2E7D32"/>
  <text x="600" y="73" text-anchor="middle" fill="white" font-weight="bold" font-size="13">Servidor</text>
  <line x1="80" y1="88" x2="80" y2="400" stroke="#42A5F5" stroke-dasharray="5,4" stroke-width="1" opacity="0.35"/>
  <line x1="600" y1="88" x2="600" y2="400" stroke="#66BB6A" stroke-dasharray="5,4" stroke-width="1" opacity="0.35"/>
  <line x1="85" y1="135" x2="592" y2="135" stroke="#FFA726" stroke-width="1.5" marker-end="url(#ao-jwt1)"/>
  <text x="340" y="122" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">1. POST /login</text>
  <text x="340" y="136" text-anchor="middle" fill="#9e9e9e" font-size="11">{ username: "...", password: "..." }</text>
  <rect x="530" y="148" width="140" height="24" rx="4" fill="#1e2a20"/>
  <text x="600" y="164" text-anchor="middle" fill="#66BB6A" font-size="11">2. Validar credenciales</text>
  <line x1="594" y1="192" x2="93" y2="192" stroke="#66BB6A" stroke-width="1.5" marker-end="url(#ag-jwt1)"/>
  <text x="340" y="179" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">3. 200 OK - Entregar token</text>
  <text x="340" y="195" text-anchor="middle" fill="#9e9e9e" font-size="11">{ accessToken: "eyJhbGciOi..." }</text>
  <rect x="10" y="207" width="140" height="24" rx="4" fill="#1a1e2a"/>
  <text x="80" y="223" text-anchor="middle" fill="#42A5F5" font-size="11">4. Almacenar token</text>
  <line x1="85" y1="268" x2="592" y2="268" stroke="#FFA726" stroke-width="1.5" marker-end="url(#ao-jwt1)"/>
  <text x="340" y="254" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">5. GET /api/recurso</text>
  <text x="340" y="270" text-anchor="middle" fill="#CE93D8" font-size="11">Authorization: Bearer eyJhbGci...</text>
  <rect x="530" y="283" width="140" height="24" rx="4" fill="#1e2a20"/>
  <text x="600" y="299" text-anchor="middle" fill="#66BB6A" font-size="11">6. Verificar firma del token</text>
  <line x1="594" y1="333" x2="93" y2="333" stroke="#66BB6A" stroke-width="1.5" marker-end="url(#ag-jwt1)"/>
  <text x="340" y="321" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">7. 200 OK - Datos del recurso</text>
  <text x="340" y="335" text-anchor="middle" fill="#9e9e9e" font-size="11">{ data: [...] }</text>
  <text x="340" y="390" text-anchor="middle" fill="#546E7A" font-size="11">Stateless: el servidor no guarda sesion — el token lleva toda la informacion</text>
</svg>
```

## JWT

El uso de tokens sigue los principios REST porque mantiene la comunicación entre el cliente y el servidor sin estado (stateless), uno de los pilares fundamentales de REST.

En lugar de almacenar información de sesión en el servidor, el token (como un JWT) contiene toda la información necesaria para autenticar una solicitud y se envía en cada petición, generalmente en el encabezado Authorization.

Esto permite que cada solicitud sea autocontenida, sin necesidad de que el servidor recuerde el estado de conexiones anteriores, cumpliendo así con la naturaleza independiente y escalable de las APIs RESTful.

## Instalación

Instale las dependencias

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

Para poder firmar nuestros tokens, se requiere mínimo 32 caracteres. Puede crearlo en el aplicacition.properties para llamarlo mediante SpEl.

```ini
app.security.secretkey=universidadicesiuniversidadicesiuniversidadicesi
app.security.expirationMinutes=30
```

Ahora ya podemos crear `JwtService` que es el proveedor de token

```java
package co.edu.icesi.introspringboot2.service.impl;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${app.security.secretkey}")
    private String secret;

    @Value("${app.security.expirationMinutes}")
    private int expirationMinutes;

    ...

}
```

El token debe ser firmado utilizando una clave secreta (secret key), lo que permite garantizar su integridad. Al usuario autenticado se le entrega un token que contiene ciertos datos, y si un atacante intenta presentar un token falso, este no superará la validación de firma, ya que no posee la clave secreta necesaria para generarlo correctamente.

## Estructura

Con esto en mente ya podemos crear un un método para generar el token. Los JWT tienen esta estrcutura

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="320" font-family="Roboto, Arial, sans-serif">
  <rect width="680" height="320" fill="#12121f" rx="12"/>
  <text x="340" y="28" text-anchor="middle" fill="#e0e0e0" font-size="15" font-weight="bold">Estructura de un JSON Web Token (JWT)</text>
  <rect x="14" y="44" width="198" height="34" rx="6" fill="#B71C1C"/>
  <text x="113" y="65" text-anchor="middle" fill="white" font-size="11" font-family="Courier New, monospace">eyJhbGciOiJIUzM4NCJ9</text>
  <text x="215" y="65" text-anchor="middle" fill="#ccc" font-size="20">.</text>
  <rect x="224" y="44" width="234" height="34" rx="6" fill="#6A1B9A"/>
  <text x="341" y="65" text-anchor="middle" fill="white" font-size="11" font-family="Courier New, monospace">eyJyb2xlcyI6WyJST0xFX1BS...</text>
  <text x="461" y="65" text-anchor="middle" fill="#ccc" font-size="20">.</text>
  <rect x="470" y="44" width="196" height="34" rx="6" fill="#1565C0"/>
  <text x="568" y="65" text-anchor="middle" fill="white" font-size="11" font-family="Courier New, monospace">3LugKiiy629iV5wWKwn...</text>
  <text x="113" y="93" text-anchor="middle" fill="#EF5350" font-size="12" font-weight="bold">HEADER</text>
  <text x="341" y="93" text-anchor="middle" fill="#CE93D8" font-size="12" font-weight="bold">PAYLOAD</text>
  <text x="568" y="93" text-anchor="middle" fill="#42A5F5" font-size="12" font-weight="bold">SIGNATURE</text>
  <rect x="14" y="103" width="198" height="80" rx="6" fill="#1a1a2e" stroke="#EF5350" stroke-width="1"/>
  <text x="113" y="120" text-anchor="middle" fill="#EF5350" font-size="10" font-weight="bold">Base64URL decode:</text>
  <text x="113" y="137" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">{</text>
  <text x="113" y="152" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "alg": "HS384"</text>
  <text x="113" y="167" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">}</text>
  <rect x="224" y="103" width="234" height="120" rx="6" fill="#1a1a2e" stroke="#CE93D8" stroke-width="1"/>
  <text x="341" y="120" text-anchor="middle" fill="#CE93D8" font-size="10" font-weight="bold">Base64URL decode:</text>
  <text x="341" y="137" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">{</text>
  <text x="341" y="152" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "email": "user@mail.com",</text>
  <text x="341" y="167" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "iat": 1744298415,</text>
  <text x="341" y="182" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">  "exp": 1744300215</text>
  <text x="341" y="197" text-anchor="middle" fill="#e0e0e0" font-size="11" font-family="Courier New, monospace">}</text>
  <rect x="470" y="103" width="196" height="120" rx="6" fill="#1a1a2e" stroke="#42A5F5" stroke-width="1"/>
  <text x="568" y="120" text-anchor="middle" fill="#42A5F5" font-size="10" font-weight="bold">HMACSHA384(</text>
  <text x="568" y="140" text-anchor="middle" fill="#e0e0e0" font-size="10" font-family="Courier New, monospace">base64(header)</text>
  <text x="568" y="157" text-anchor="middle" fill="#9e9e9e" font-size="10">+ "." +</text>
  <text x="568" y="174" text-anchor="middle" fill="#e0e0e0" font-size="10" font-family="Courier New, monospace">base64(payload),</text>
  <text x="568" y="191" text-anchor="middle" fill="#9e9e9e" font-size="10">secret</text>
  <text x="568" y="208" text-anchor="middle" fill="#42A5F5" font-size="10">)</text>
  <text x="340" y="255" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">Header y Payload son legibles — la Signature los protege</text>
  <text x="340" y="275" text-anchor="middle" fill="#546E7A" font-size="11">Nunca guardes datos sensibles (contrasenas, tarjetas) en el Payload</text>
  <text x="340" y="295" text-anchor="middle" fill="#546E7A" font-size="11">Sin el secret, un atacante no puede generar una firma valida</text>
</svg>
```

El método para crearlo puede ser

```java
public String generateToken(UserDetails userDetails) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + 1000L * 60L * expirationMinutes);

    return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
}
```

Donde note que se crea a partir de los userDetails. En general el subject de un JWT tiene el username/email del usuario propietario del token.

¿Qué pasa si queremos darle más datos al token?. Lo podemos hacer para incluir el rol del usuario, así como sus authorities.

Incluso esto nos ayudaría a saber cuál es el UserDetails a partir de la información del token. Esta información se denomina claims. Podemos crearlos a partir del UserDetails.

```java
public Map<String, Object> createClaims(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userDetails.getUsername());
        claims.put("authorities",
                userDetails.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .toList());
        return claims;
    }
```

Con esto, lo podemos incluir los claims en el token

```java
//return Jwts.builder()
            .setClaims( createClaims(userDetails) )
//          .compact();
```

## Cadena de filtros

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="460" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="ad-chain3" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
      <polygon points="0 0,6 2.5,0 5" fill="#546E7A"/>
    </marker>
    <marker id="ado-chain3" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
      <polygon points="0 0,6 2.5,0 5" fill="#FFA726"/>
    </marker>
  </defs>
  <rect width="680" height="460" fill="#12121f" rx="12"/>
  <text x="340" y="28" text-anchor="middle" fill="#e0e0e0" font-size="15" font-weight="bold">Security Filter Chain — Insercion del JwtAuthFilter</text>
  <rect x="270" y="40" width="140" height="28" rx="14" fill="#263238"/>
  <text x="340" y="58" text-anchor="middle" fill="#90A4AE" font-size="12">Request HTTP</text>
  <line x1="340" y1="68" x2="340" y2="76" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="78" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="96" text-anchor="middle" fill="#78909C" font-size="12">CorsFilter</text>
  <line x1="340" y1="106" x2="340" y2="114" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="116" width="400" height="28" rx="5" fill="#1a2020" stroke="#2a3a2a" stroke-width="1"/>
  <text x="340" y="134" text-anchor="middle" fill="#455A64" font-size="12">CsrfFilter  (deshabilitado para REST)</text>
  <line x1="340" y1="144" x2="340" y2="152" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="154" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="172" text-anchor="middle" fill="#78909C" font-size="12">LogoutFilter</text>
  <line x1="340" y1="182" x2="340" y2="190" stroke="#FFA726" stroke-width="1.5" marker-end="url(#ado-chain3)"/>
  <rect x="110" y="192" width="460" height="36" rx="6" fill="#1a1500" stroke="#FFA726" stroke-width="2"/>
  <text x="310" y="213" text-anchor="middle" fill="#FFA726" font-size="13" font-weight="bold">JwtAuthFilter</text>
  <text x="500" y="213" text-anchor="middle" fill="#FFA726" font-size="11">NUEVO</text>
  <line x1="340" y1="228" x2="340" y2="236" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="238" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="256" text-anchor="middle" fill="#78909C" font-size="11">UsernamePasswordAuthenticationFilter</text>
  <line x1="340" y1="266" x2="340" y2="274" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="276" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="294" text-anchor="middle" fill="#78909C" font-size="12">AnonymousAuthenticationFilter</text>
  <line x1="340" y1="304" x2="340" y2="312" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="314" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="332" text-anchor="middle" fill="#78909C" font-size="12">ExceptionTranslationFilter</text>
  <line x1="340" y1="342" x2="340" y2="350" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="140" y="352" width="400" height="28" rx="5" fill="#1e2d3a" stroke="#37474F" stroke-width="1"/>
  <text x="340" y="370" text-anchor="middle" fill="#78909C" font-size="12">FilterSecurityInterceptor</text>
  <line x1="340" y1="380" x2="340" y2="388" stroke="#546E7A" stroke-width="1.5" marker-end="url(#ad-chain3)"/>
  <rect x="240" y="390" width="200" height="32" rx="8" fill="#1B5E20" stroke="#2E7D32" stroke-width="1.5"/>
  <text x="340" y="410" text-anchor="middle" fill="#66BB6A" font-size="13" font-weight="bold">Controller (Endpoint)</text>
  <text x="340" y="445" text-anchor="middle" fill="#546E7A" font-size="11">El JwtAuthFilter valida el token antes de que el request llegue al resto de la cadena</text>
</svg>
```

Vamos a hacer entonces el Controller RestAuthenticationController con un endpoint para permitir login de nuestros usuarios.

## DTO

Tenemos que tener dos DTO. Uno para el Request que incluya email/username y password. Otro para el Response donde podamos enviar el token producido.

```java
public class AuthRequest {
    private String username;
    private String password;
    ...
}

public class AuthResponse {
    private String accessToken;
    ...
}
```

## Primer endpoint de login

Nuestro primer protipo de login es

```java
@Autowired
private JwtService jwtService;

@Autowired
private CustomUserDetailService customUserDetailService;

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {
    //Proceso de autenticación

    //Creación de token
    UserDetails userDetails = customUserDetailService.loadUserByUsername(request.getUsername());
    String jwt = jwtService.generateToken(userDetails);

    var response = new AuthResponse(jwt);
    return ResponseEntity.ok(response);
}
```

Si utiliza el método, este es capaz de crear el token. Sin embargo, aún no tenemos implementado el proceso de autenticación.

De acuerdo con la cadena de autenticación Stateful es que el request pasa por `UsernamePasswordAuthenticationFilter` > `AuthenticationManager` > `DaoAuthenticationProvider` > `UserDetailService`

## Filter chain para JWT

Debemos modificar la cadena y para esto debemos configurar el SecurityFilterChain. Debemos lograr que los procesos de authentication como por ejemplo `/login`, `/signup`, `/refresh` sean de acceso público.

Además configuremos que el CSRF Token quede deshabilitado y además que las sesiones sean estilo stateless de modo que no se guarde HTTP Session.

```java
@Bean
@Order(2)
public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
    http
        .securityMatcher("/api/v1/**")
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/**").permitAll()
            .anyRequest().authenticated()
        )
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    return http.build();
}
```

## Proceso de autenticación

Adicionalmente necesitamos poder usar el AuthenticationManager, para eso podemos definir el bean en nuestro WebSecurityConfig

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

Una vez con el objeto, podemos autenticar los datos que nos llegan al endpoint.

```java
//@Autowired
//private JwtService jwtService;

//@Autowired
//private CustomUserDetailsService customUserDetailsService;

  @Autowired
  private AuthenticationManager authenticationManager;

//@PostMapping("/login")
//public ResponseEntity<?> login(@RequestBody AuthRequest request) {
      
      authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
      );
        
//    UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUsername());
//    String jwt = jwtService.generateToken(userDetails);

//    var response = new AuthResponse(jwt);
//    return ResponseEntity.ok(response);
//}
```

El AuthenticationManager llamará a DaoAuthenticationProvider > UserDetailService > UserService > UserRepository > DB. Con esto hacemos la comparación con base de datos

Al final de todo el proceso, la respuesta esperada es algo asi

```js
{
    "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJST0xFX1BST0ZFU1NPUiJdLCJlbWFpbCI6InByb2Zlc29yQGdtYWlsLmNvbSIsInN1YiI6InByb2Zlc29yQGdtYWlsLmNvbSIsImlhdCI6MTc0NDI5ODQxNSwiZXhwIjoxNzQ0MzAwMjE1fQ.3LugKiiy629iV5wWKwnGAmXsX42lH-t2UFwUKF2bMqzLTOHAxUzVFPpiVe3qbzVu"
}
```

Aquí, `eyJhbGciOiJIUzM4NCJ9` es igual a

```plain
eyJhbGciOiJIUzM4NCJ9

es igual a

Base64URL(
    {
        "alg": "HS384"
    }
)
```

`eyJyb2xlcyI6WyJST0x`... es igual a

```plain
Base64URL(
    {
      "roles": ["ROLE_PROFESOR"],
      "email": "profesor@gmail.com",
      "sub": "profesor@gmail.com",
      "iat": 1744298415,
      "exp": 1744300215
    }
)
```

`3LugKiiy629iV5wWKwnGAmXsX42lH-t2UFwUKF2bMqzLTOHAxUzVFPpiVe3qbzVu` es igual a

```plain
base64(header) + "." + base64(payload)
```
