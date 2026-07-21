# Servidor web multi-hilos

En esta lección afinarás tu servidor web para que pueda responder a la petición de diversos recursos: archivos HTML (`text/html`) e imágenes (`image/jpeg`, `image/gif`). El servidor analizará la solicitud HTTP y enviará una respuesta apropiada al browser.

![Diagrama de respuesta de recursos](image2.png "icon")

## Extracción del recurso solicitado

El nombre del archivo solicitado se extrae de la línea de solicitud HTTP usando `StringTokenizer`. Se asume que el método es siempre `GET`.

```java
// Extrae el nombre del archivo de la línea de solicitud.
StringTokenizer partesLinea = new StringTokenizer(linea);
String method = partesLinea.nextToken();
String nombreArchivo = partesLinea.nextToken();
nombreArchivo = "." + nombreArchivo;
```

El browser precede el nombre del archivo con `/`, por eso se antepone un punto para indicar el directorio actual.

## Envío de archivos y manejo de errores

El servidor debe buscar el archivo solicitado y enviarlo al cliente. Si el archivo no existe, debe responder con un mensaje HTTP 404 y un archivo de error.

```java
InputStream inputStream = ClassLoader.getSystemResourceAsStream(nombreArchivo);
File file = new File(ClassLoader.getSystemResource(nombreArchivo).toURI());
long filesize = file.length();
```

Para enviar la respuesta, usa un `BufferedOutputStream`:

```java
BufferedOutputStream out = new BufferedOutputStream(socket.getOutputStream());
```

Para enviar texto

```java
private static void enviarString(String line, OutputStream os) throws Exception {
    os.write(line.getBytes(StandardCharsets.UTF_8));
}
```

Para enviar bytes

```java
private static void enviarBytes(InputStream fis, OutputStream os) throws Exception {
    byte[] buffer = new byte[1024];
    int bytes = 0;
    while ((bytes = fis.read(buffer)) != -1) {
        os.write(buffer, 0, bytes);
    }
}
```

## Construcción de la respuesta HTTP

La respuesta HTTP tiene tres partes: línea de estado, headers y cuerpo. Si el archivo existe, se determina el tipo MIME y se envía el archivo. Si no, se responde con 404 y un HTML de error.

```java
String lineaDeEstado = null;
String lineaHeader = null;
String cuerpoMensaje = null;

if ( /* archivo existe */ ) {
    lineaDeEstado = /* 200 OK */; 
    lineaHeader = "Content-type: " + contentType(nombreArchivo) + CRLF;
    // Enviar línea de estado
    // Enviar header
    // Enviar archivo
} else {
    lineaDeEstado = "HTTP/1.0 404 Not Found\r\n";
    lineaHeader = /* header error */;
    // Enviar línea de estado
    // Enviar header
    // Enviar archivo 404.html
}
out.flush();
```

## Detección del tipo de archivo (MIME)

El tipo de archivo se determina con un método auxiliar

```java
private static String contentType(String nombreArchivo) {
    if(nombreArchivo.endsWith(".htm") || nombreArchivo.endsWith(".html")) {
        return "text/html";
    }
    if(nombreArchivo.endsWith(".jpg")) {
        return "image/jpeg";
    }
    if(nombreArchivo.endsWith(".gif")) {
        return "image/gif";
    }
    return "application/octet-stream";
}
```

## Ejemplo de Request

![Ejemplo de solicitud HTTP](image3.png "icon")

## Ejemplo de Response

![Ejemplo de respuesta HTTP](image4.png "icon")

¡Ahora tu servidor puede servir archivos y recursos estáticos como un servidor web real!
