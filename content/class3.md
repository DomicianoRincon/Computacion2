# Sesión 3 · 5 de Agosto

Mayoriatariamente hicimos la configuración del ambiente de ejecución al instalar Tomcat y maven.

Hicimos un proyecto maven con este `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <packaging>war</packaging>
    <groupId>org.example</groupId>
    <artifactId>MiPrimeraAPP</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>6.1.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

Y este servlet

```java
package org.example.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@WebServlet("/hello")
public class MiPrimerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        resp.getWriter().println("<h1>Este es un servlet "+new Date() +"</h1>");
    }
}
```

Cada vez que quería probar los cambios en el servlet usaba `mvn clean package`. Esto produce un `war` que es la aplicación web empaquetada. Ese paquete llamado por ejemplo `miapp.war` lo copio y pego en la carpeta `webapps`. Si el Servidor de Apps está en ejecución automaticamente descomprime el war generando una carpeta llamada `miapp`.

Para probar usé la URL

```plain
http://localhost:8080/miapp/hello
```

Finalmente usamos los comando `ssh` y `scp`. Para mayor información mire el enlace

[SSH y SCP](https://i2thub.icesi.edu.co:5443/compu2/lesson/6)
