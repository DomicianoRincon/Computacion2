# Servidor de Aplicaciones

En esta lección aprenderás a trabajar con el servidor de aplicaciones Tomcat, configurarlo manualmente y desplegar aplicaciones Java usando Maven y servlets. Verás las diferencias clave entre un servidor web y un servidor de aplicaciones.

![Diagrama de servidor de aplicaciones Tomcat](image5.png "icon")

## Descarga y configuración de Tomcat

Descarga Tomcat 11 desde:

```plain
https://tomcat.apache.org/download-11.cgi
```

Descomprime el `ZIP`. Si usas Mac o Linux, da permisos de ejecución a los scripts:

```bash
chmod +x bin/*.sh
```

Parado sobre la carpeta raíz de `tomcat`

## Variable de entorno `JAVA_HOME`

Debes crear una variable de entorno que apunte a la ruta donde está instalado java.
Ruta típica en Windows

```bash
C:\Program Files\Java\jdk-21
```

Ruta típica en Linux

```bash
/usr/lib/jvm/java-21-openjdk-amd64
```

Ruta típica en Mac

```bash
/opt/homebrew/opt/openjdk@21
```

Si no la encuentras prueba en Windows

```bash
where java
```

En Mac/Linux

```bash
which java
```

## Servidor web

Tomcat es un servidor de aplicaciones, es decir, un servidor web capaz de ejecutar aplicaciones escritas en un lenguaje específico, en este caso Java, mediante tecnologías como Servlets y JSP.

Vaya a la carpeta webapps de tomcat, cree una carpeta llamada `miapp1` y dentro cree un archivo `index.html`.

Ejecute el servidor por medio de 

```sh
./startup.sh
```

## Crear un proyecto Maven y dependencias

Crea un proyecto Maven y agrega la dependencia de Jakarta Servlet API en tu `pom.xml`:

```xml
<dependencies>
  <dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.1.0</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
```

## Empaquetado como WAR

Configura el empaquetado como `war` en el `pom.xml`:

```xml
<packaging>war</packaging>
```

## Verificar versión de Java

Asegúrate de que la versión de Java en tu sistema y en tu IDE coincidan. Puedes verificarlo con:

```sh
java -version
```

En el `pom.xml` puedes especificar la versión:

```xml
<properties>
  <maven.compiler.source>21</maven.compiler.source>
  <maven.compiler.target>21</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

## Estructura de carpetas del proyecto

La estructura típica de un proyecto web con Maven y Tomcat es:

```plain
📦 project
 ┣ 📂 src
 ┃ ┗ 📂 main
 ┃   ┣ 📂 java
 ┃   ┃  ┗ 📂 com.icesi.webappexample
 ┃   ┃    ┗ 📂 servlet
 ┃   ┃       ┗ 📜 ServletExample.java
 ┃   ┣ 📂 resources              
 ┃   ┗ 📂 webapp
 ┃      ┗ 📜 index.jsp
 ┗ 📜 pom.xml 
```

## Crear un Servlet básico

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

## Empaquetar y desplegar el WAR

Para empaquetar el proyecto ejecuta:

```sh
mvn clean package
```

Esto generará el archivo `.war` en la carpeta `target`. Copia el `.war` a la carpeta `webapps` de Tomcat 

Encender el servidor

```sh
./startup.sh
```

Accede a la aplicación en:

```plain
http://localhost:8080/<nombre>
```

Y al servlet en:

```plain
http://localhost:8080/<nombre>/hello
```

## Ciclo de vida

Todo servidor de aplicaciones Java contiene un Servlet Container, que es el componente encargado de gestionar el ciclo de vida de los servlets, manejar las solicitudes HTTP y facilitar la comunicación entre el cliente y la aplicación web. En el caso de Tomcat, su Servlet Container se llama Catalina.

Catalina crea una única instancia de cada Servlet y la reutiliza. Para cada solicitud del cliente, el Servlet Container genera un nuevo hilo que ejecuta el método service(), el cual redirige a doGet(), doPost(), u otro método según el tipo de petición.

La instancia del servlet es inicializada una sola vez mediante el método init().

![Imagen](image6.png "icon")

Finalmente, destroy() se ejecuta una sola vez, justo antes de que el servlet sea eliminado, lo que ocurre cuando el servidor se apaga o el servlet es descargado.

Asimismo, un archivo JSP es convertido en un servlet en tiempo de ejecución por el Servlet Container. Cuando se solicita un JSP, este se traduce a una clase Java que extiende HttpServlet, se compila y luego se ejecuta para generar y entregar la respuesta al cliente.

## `mvn` en tu sistema

Conviene muchísimo instalar maven en su sistema. Para eso, descarga Maven en

```bash
https://maven.apache.org/download.cgi
```

Descarga el `.zip`, descomprímelo y agrega a tu variable `PATH` la ruta de la carpeta `bin` de maven.

Si estás en Windows, debes entrar a 

```bash
Configuración avanzada del sistema > Variables de Entorno > Variables del Sistema
```

Busca la variable `PATH` para editarla y agregarle la ruta de maven.

En Linux o Mac debes editar tu archivo `.bashrc` o `.zshrc` de acuerdo al shell que manejas. Para saber cuál es tu shell usa

```bash
echo $SHELL
```

Una vez que haya agregado la ruta de maven a `PATH`, cierra el shell y vuélvelo a abrir. Usa el comando

```bash
mvn
```

Si reconoce el comando ya tienen maven en tu sistema.
