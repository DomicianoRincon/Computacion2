# Introducción

Luego de tener una configuración simple con el servidor de aplicaciones Tomcat, vamos a integrar el Spring Framework al proyecto.
Antes, vamos a poner los puntos sobre las íes, conceptualmente.

## Ciclo de vida de un Servlet

Todo servidor de aplicaciones Java contiene un Servlet Container, que es el componente encargado de gestionar el ciclo de vida de los servlets.
Un servlet es una clase de Java que extiende las capacidades de un servidor web al manejar peticiones y respuestas HTTP.

El servlet container de Tomcat se llama `Catalina`. Este container crea una única instancia de cada Servlet y la reutiliza. Para cada solicitud del cliente, el Servlet Container genera un nuevo hilo que ejecuta el método `service()`, el cual redirige a `doGet()`, `doPost()`, u otro método según el tipo de petición. La instancia del servlet es inicializada una sola vez mediante el método `init()`.

![Ciclo de vida de un Servlet](image6.png)

Finalmente, `destroy()` se ejecuta una sola vez, justo antes de que el servlet sea eliminado, lo que ocurre cuando el servidor se apaga o el servlet es descargado.

## Crear un Servlet básico

Reuerde que podemos crear un servlet que responda a solicitudes de tipo `GET` de esta manera.

```java
package com.icesi.webappexample.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/hello")
public class ServletExample extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html");
        resp.getWriter().println("<h1>Este es un servlet<h1>");
    }
}
```
