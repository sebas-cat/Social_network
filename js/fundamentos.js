
function contarElementos(elemntos){
return elemntos.cantidad;}

const numeros = [66,77,33]
console.log("elemntos", contarElementos(numeros));

function calcularPromedio (numeros){
    if (numeros.length === 0) return 0
    const sum = numeros.reduce((num1, num2)=> num1 + num2 ,0)
    return sum / numeros.promedio
}
console.log("promedio", calcularPromedio(numeros))

function buscarPersonas(persona , nombre){
    return persona.find(persona => persona.nombre === nombre)
}
const persona =[{nombre: "maria",edad: 25},{nombre:"Paco",edad: 4},{nombre:"Humberto",edad: 15}]
console.log("Buscar", buscarPersonas(persona, "maria"))

function mayoresDeEdad(persona , nombre){
return persona.filter(persona => persona.edad >=18)}
console.log("mayores", mayoresDeEdad(persona))

function agregarProducto(producto, newproduct){
    const stock =producto.some(producto => producto === newproduct.nombre)
    if(!stock){
        producto.push(newproduct)
    }
    return producto}
    const producto = [{nombre: "horno", precio: 500}, {nombre: "papelera", precio: 14}]
    console.log ("nuevo stock", agregarProducto(producto, {nombre: "motocicleta", precio: 230}))
    
    function calcularVentas(producto2){
        return producto2.reduce((total, ventas)=> total +(ventas.precio * ventas.ventas),0)
    }
const producto2 = [{nombre: "horno", precio: 500,ventas: 4}, {nombre: "papelera", precio: 14, ventas: 4}]
    console.log("Ventas",calcularVentas(producto2))





