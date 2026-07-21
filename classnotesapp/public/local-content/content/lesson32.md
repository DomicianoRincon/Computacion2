# Repasito de JS

JavaScript es un lenguaje de programación interpretado, creado originalmente por Netscape en 1995, diseñado para dotar de interactividad a las páginas web. A diferencia de HTML y CSS, que controlan la estructura y el estilo, JavaScript permite manipular el DOM, responder a eventos, validar formularios y crear experiencias dinámicas en el navegador. Con el tiempo, su uso se expandió más allá del entorno del cliente gracias a entornos como Node.js, convirtiéndose en uno de los lenguajes más versátiles del ecosistema web.

## Uso del elemento en HTML

```html
<body>
  ...
  <script type="module" src="./main.js"></script>
</body>
```

o

```html
<head>
  <script type="module" src="./main.js" defer></script>
</head>
```

## var

Permite redeclaración.

```js
var mensaje = "Hola";
var mensaje = "Hola otra vez"; // válido
console.log(mensaje); // "Hola otra vez"
```

Además tiene alcance de función

```js
function ejemploIf() {
  if (true) {
    var mensaje = "Hola desde el if";
    console.log(mensaje); // "Hola desde el if"
  }
  console.log(mensaje); // Accesible: "Hola desde el if"
}

ejemploIf();
```

## let

No permite redeclaración

```js
let nombre = "Ana";
// let nombre = "Laura"; // Error: ya declarado
nombre = "Laura"; // Permitido
console.log(nombre); // "Laura"
```

Además tiene alcance en el contexto `{}` donde fue declarado

```js
function ejemploIfConLet() {
  if (true) {
    let mensaje = "Hola desde el if";
    console.log("Dentro del if:", mensaje); // "Hola desde el if"
  }
  console.log("Fuera del if:", mensaje); // Error: mensaje is not defined
}

ejemploIfConLet();
```

## const

Es igual que `let` pero no permite reasignación

```js
const PI = 3.1416;
// PI = 3.15; // Error: no se puede cambiar
console.log(PI);
```

## Primitivos de datos

```js
let texto = "Hola mundo";       // string
let edad = 25;                  // number
let activo = true;              // boolean
let vacio = null;               // null (intencionalmente vacío)
let indefinido;                 // undefined (sin valor asignado)

console.log(typeof texto);      // string
console.log(typeof edad);       // number
console.log(typeof activo);     // boolean
console.log(typeof vacio);      // object (quirk de JS)
console.log(typeof indefinido); // undefined
```

## Objetos

```js
const persona = {
  nombre: "Carlos",
  edad: 30,
  activo: true
};

console.log(persona.nombre); // "Carlos"
console.log(persona["edad"]); // 30

persona.edad = 31;
console.log(persona.edad); // 31
```

## Arreglos

```js
const frutas = ["manzana", "pera", "uva"];

console.log(frutas[0]); // "manzana"
frutas.push("banano");  // agregar
console.log(frutas.length); // 4

frutas[1] = "kiwi";
console.log(frutas); // ["manzana", "kiwi", "uva", "banano"]
```

## Desestructuración de Objetos

```js
const usuario = {
  nombre: "Lucía",
  correo: "lucia@example.com",
  rol: "admin"
};

// Extraer propiedades en variables
const { nombre, rol } = usuario;

console.log(nombre); // "Lucía"
console.log(rol);    // "admin"
```

## Funciones

```js
function saludar(nombre) {
  return "Hola, " + nombre + "!";
}

console.log(saludar("Ana")); // "Hola, Ana!"
```

```js
const despedir = function(nombre) {
  return "Adiós, " + nombre + "!";
};

console.log(despedir("Luis")); // "Adiós, Luis!"
```

```js
const multiplicar = (a, b) => {
  return a * b;
};

console.log(multiplicar(4, 5)); // 20
```

## Desestructuración y funciones

```js
const mostrarUsuario = ({ nombre, correo }) => {
  console.log("Nombre:", nombre);
  console.log("Correo:", correo);
};

mostrarUsuario({
  nombre: "María",
  correo: "maria@example.com",
  rol: "admin"
});
// Salida:
// Nombre: María
// Correo: maria@example.com
```
