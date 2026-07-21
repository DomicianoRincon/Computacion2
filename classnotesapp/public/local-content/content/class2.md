# Sesión 2 · 31 de Julio

Este fue el programa que creamos en la sesión 1

## HTTP Server multihilo

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class Main {

    public void init() throws IOException {
        ServerSocket server = new ServerSocket(8050);
        var isAlive = true;
        while (isAlive) {
            System.out.println("Esperando cliente...");
            var socket = server.accept();
            System.out.println("¡Cliente conectado!");
            dispatchWorker(socket);
        }
    }

    public void dispatchWorker(Socket socket){
        new Thread(
                ()->{
                    try {
                        handleRequest(socket);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
        ).start();
    }

    public void handleRequest(Socket socket) throws IOException {
        var reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null && !line.isEmpty()) {
            if(line.startsWith("GET")){
                var resource = line.split(" ")[1].replace("/", "");
                System.out.println("El cliente esta pidiendo: "+resource);
                //Enviar la response
                sendResponse(socket, resource);
            }
        }
    }
    public void sendResponse(Socket socket, String resource) throws IOException {

        var file = new File("");
        System.out.println(file.getAbsolutePath());
        var res = new File("resources/"+resource);

        if(res.exists()){
            var fis = new FileInputStream(res);
            var br = new BufferedReader(new InputStreamReader(fis));
            String line;
            StringBuilder response = new StringBuilder();
            while ((line = br.readLine()) != null) {
                response.append(line);
            }

            var writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
            //COPY

            writer.write("HTTP/1.1 200 OK\r\n");
            writer.write("Content-Type: text/html\r\n");
            writer.write("Content-Length: " + response.length()+"\r\n");
            writer.write("Connection: close\r\n");
            writer.write("\r\n");
            writer.write(response.toString());

            writer.close();
            socket.close();
            //PASTE
        }else {
            System.out.println("No se encontro el archivo");
        }

    }

    public static void main(String[] args) throws IOException {
        Main main = new Main();
        main.init();
    }
}
```

Esto funciona siempre y cuando tengamos en la raíz del proyecto una carpeta llamada `resources` con los archivos base
