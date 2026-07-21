# Sesión 1 · 29 de Julio

Este fue el programa que creamos en la sesión 1

## HTTP Server primitivo

```java
import java.io.*;
import java.net.ServerSocket;

public class Main {
    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(8050);

        var isAlive = true;
        while (isAlive) {
            System.out.println("Esperando cliente...");
            var socket = server.accept();
            System.out.println("¡Cliente conectado!");

            var writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

            var reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null && !line.isEmpty()) {
                System.out.println(line);
            }

            //Response
            var response = "<html><body><h1>Hola a todos</h1></body></html>";
            writer.write("HTTP/1.1 200 OK\r\n");
            writer.write("Content-Type: text/html\r\n");
            writer.write("Content-Length: " + response.length()+"\r\n");
            writer.write("Connection: close\r\n");
            writer.write("\r\n");
            writer.write(response);

            writer.close();
            socket.close();
        }
        server.close();
    }
}
```
