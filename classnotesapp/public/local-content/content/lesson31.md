# Postman

Postman es una plataforma popular para la construcción y uso de APIs. Ofrece una interfaz de usuario amigable que permite a los desarrolladores enviar solicitudes HTTP, probar APIs, y organizar sus flujos de trabajo de desarrollo de manera eficiente. Con Postman, puedes crear y guardar solicitudes, organizar colecciones de APIs, y automatizar pruebas para asegurar que tus APIs funcionen como se espera.

## Colecciones en Postman

Las colecciones de Postman son una forma de agrupar solicitudes API relacionadas. Permiten organizar tu trabajo, compartirlo con tu equipo y ejecutar múltiples solicitudes en secuencia. Una de las características más potentes de las colecciones es el "Collection Runner", que te permite ejecutar todas las solicitudes dentro de una colección (o una carpeta dentro de ella) en un orden específico, y aplicar scripts de prueba para validar las respuestas.

## Verificación de Respuestas con Collection Runner

El Collection Runner de Postman permite ejecutar pruebas automatizadas en las respuestas de tus solicitudes. A continuación, se muestran ejemplos de cómo puedes verificar diferentes aspectos de las respuestas utilizando los scripts de prueba de Postman.

## Verificar el status HTTP de una response

```js
pm.test("200 OK", function () {
    pm.response.to.have.status(200);
});
```

## Verificar la presencia de cualquier variable en la respuesta JSON

```js
pm.test("Has access token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
});
```

## Verificar si recibe un arreglo en la respuesta JSON

```js
pm.test("Got an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array").that.is.not.empty;
});
```

## Verificar nulidad

Que una propiedad no venga ni nula 

```js
pm.test("'name' is valid", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.not.be.null;
});
```

Ni vacía en la respuesta JSON

```js
pm.test("'name' is valid", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.not.eql("");
});
```

## Verificar si es un objeto la respuesta JSON

```js
pm.test("Got an object", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});
```

## Guardar token

```js
let json = pm.response.json();
pm.environment.set("accessToken", json.accessToken);
```

Puede incluso guardar el token
