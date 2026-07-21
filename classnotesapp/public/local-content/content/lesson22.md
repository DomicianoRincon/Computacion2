# Extra: Fragments de Thymeleaf

En Thymeleaf, a menudo nos encontramos repitiendo las mismas partes de una página web en múltiples plantillas. Por ejemplo, el encabezado (header), el pie de página (footer) o una barra de navegación (navbar) suelen ser idénticos en todo el sitio. Copiar y pegar este código es ineficiente y difícil de mantener.

Aquí es donde entran lo fragments

## ¿Qué son los Fragments?

Los fragments son porciones de código HTML que podemos definir una vez y reutilizar en cualquier otra plantilla. Esto nos permite modularizar nuestras vistas, haciendo que el código sea más limpio, mantenible y reutilizable.
La idea es simple: se defie un bloque de código como un fragmento con un nombre único y luego lo invocamos desde otras plantillas para que se inserte en el lugar deseado.

## Definiendo un Fragment

Para definir un fragmento, usamos el atributo `th:fragment`. Este atributo se puede aplicar a casi cualquier etiqueta HTML.

Imaginemos que queremos crear una barra de navegación, así que podemos generar la barra en el archivo `navbar.html`

```html
<div th:fragment="navbar">
    <nav>
        <ul>
            <li><a th:href="@{/}">Inicio</a></li>
            <li><a th:href="@{/cursos}">Cursos</a></li>
            <li><a th:href="@{/profesores}">Profesores</a></li>
            <li><a th:href="@{/estudiantes}">Estudiantes</a></li>
        </ul>
    </nav>
</div>
```

## Usando Fragments

En Thymeleaf, los fragmentos pueden reutilizarse en otras plantillas mediante dos atributos principales: 
`th:insert`
Que inserta únicamente el contenido interno del fragmento dentro de la etiqueta donde se invoca (manteniendo dicha etiqueta en el HTML final)
`th:replace`
Que reemplaza por completo la etiqueta de invocación con el fragmento entero, sustituyendo tanto la etiqueta como su contenido.

La sintaxis general es `nombre_plantilla :: nombre_fragmento`.

Vamos a usar nuestro fragment. Por ejemplo necesito esa barra en mi `index.html`

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Página Principal</title>
</head>
<body>
    <h1>¡Bienvenido a nuestra página!</h1>
    <p>Este es el contenido principal de la página.</p>

    <!-- Aquí incluiremos nuestro footer -->
    <div th:replace="fragments :: navbar"></div>

</body>
</html>
```
