
function saludar(nombre){
    return `Hola ${nombre}`
}
console.log(saludar('sebastian'))

/*const sumar = function(p1,p2){
    return p1 + p2

}
console.log(sumar(5,3));
console.log(sumar(6,8));
console.log(sumar(7,2));
*/
const sumar = (p1,p2)=>p1 + p2 //   => subsituye function por la flecha, se pasan los parametros despues de la felcha en vez de return
    


console.log(sumar(5,3));
console.log(sumar(6,8));
console.log(sumar(7,2));

//call back function
// funciones que reciben por parametro otra funcion (callback va por parametro)
const procesarSaludos = (fnCallBack)=>{
    let nombre =["Ana","Pedro", "Paco"];
for (let index =0; index < nombre.length; index++){

console.log(fnCallBack(nombre[index]))
}
}
(procesarSaludos(saludar));

/* Arreglos: []*/
var frutas = ["apple","mango","grapes"];


frutas.push("banana","pear")
//frutas.pop() quita
console.log(frutas);
console.log(frutas.join(" "));
var li = frutas.map(fruta => `<li>${fruta}</li>`).join('');
document.getElementById('lst').innerHTML = li
frutas.forEach((fruta)=> console.log(fruta));



