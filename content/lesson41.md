# Spring IoC Container

El IoC Container es un componente de Spring que gestiona instancias de objetos llamados beans. Un bean es cualquier clase de la aplicación que se registra en el contenedor, ya sea de forma explícita o automática. El IoC Container se encarga de crear, configurar y administrar sus instancias, permitiendo su uso en diferentes partes de la aplicación sin necesidad de instanciarlos manualmente.

Inicialmente vamos a registrarlos de forma explícita. Para eso necesitamos primero el IoC Container.

## Instalación del IoC Container

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.2.2</version>
</dependency>
```

## Ejemplo de Bean

La aplicación tendrá una lista de mensajes que se llenará en la medida que clientes envíen los mensajes. Tenga en cuenta que no tenemos persistencia. Por lo cual una vez el servidor haya terminado su ejecución, la información se perderá.

```java
import java.util.ArrayList;
import java.util.List;

public class MessageRepository {
    private final List<String> messages = new ArrayList<>();

    public void addMessage(String message) {
        messages.add(message);
    }

    public List<String> getMessages() {
        return messages;
    }
}
```

## Registro del Bean en el IoC Container

En `resources`, cree un archivo llamado `applicationContext.xml`, cuyo contenido es el siguiente:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="messageRepository" class="org.example.yourproject.repository.MessageRepository" />
    
</beans>
```

## Creación del IoC Container

Aquí lo que va a hacer es crear un contexto para la aplicación de modo que el IoC Container podrá ser accedido en cualquier parte de la aplicación. El IoC Container contendrá los beans dentro del XML.

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Application {

    private static final ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

    public static ApplicationContext getContext() {
        return context;
    }

}
```

## Uso del bean

Cree un Servlet que permita el uso del bean. Tendrá un método POST que recibirá un parámetro llamado `message` que se agregará al arreglo del Bean.

```java
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/messages")
public class MessageServlet extends HttpServlet {

    private MessageRepository messageRepository;

    @Override
    public void init() {
        messageRepository = (MessageRepository) Application.getContext().getBean("messageRepository");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String newMessage = req.getParameter("message");
        if (newMessage != null && !newMessage.trim().isEmpty()) {
            messageRepository.addMessage(newMessage);
        }
        resp.sendRedirect("./");
    }
    
}
```

## Hands-on con el IoC Container

Vamos a crear un sitio web sencillo donde podamos registrar elementos en una lista de compras.
Para eso vamos a necesitar 

- Un bean que permita almacenar datos en memoria de aplicación (volátil)
- Luego un servlet deberá poder usar el mencionado bean de modo que el usuario pueda obtener la lista de elementos
- Ese bean también debería ofrecernos el medio para insertar elementos.
