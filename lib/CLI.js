#!/usr/bin/env node
//paso todo a mi rama master, ejecutar comando de npm install -g Claraescobar123/bog001-md-links,
//se va instalar, y ya puedo ejecutar mi comando mdLinks
const process = require('process');
//const path = require('path');
const mdLinks = require('./index.js').mdLinks;

//Imprimir en consola
/*option('-s, --stats', 'returns total and unique stats')
option('-v, --validate', ' returns all links in .md files')
option('-v -s, --validate --stats', ' returns total, unique, broken and ok')
option('-s -v, --stats --validate', 'Returns total, unique, broken and ok ')*/

//Variables del path y las opciones acorde a las posiciones en la linea de comandos
let route = process.argv[2]; //path
let firstOption = process.argv[3]; //opción de 'validate' o 'stats'
let secondOption = process.argv[4]; // opción de 'stats' o 'validate'
//console.log(firstOption,secondOption) 

//Opciones
let options = {
  validate: false,
  stats: false
}

//Si el usuario ingresa la opción 'validate',cambia a verdadero
if (firstOption === '--validate' || secondOption === '--validate') {
  options.validate = true;
  //console.log('VALIDATE',options.validate);
} 

//Si el usuario ingresa la opción 'stats',cambia a verdadero
if (firstOption === '--stats' || secondOption === '--stats') {
  options.stats = true;
  //console.log('STATS',options.stats);
}

//Si no ingresa ningun archivo, que le pida al usuario porfavor ingresar
if (route === false || route === undefined) {
  console.log('Por favor ingresa una ruta o archivo');
}

//Después imprimir en consola
mdLinks(route, options)
.then(console.log)/*res => {
  if(options.validate && options.stats){
    return console.log(("Total Links: " + res.Total) + "\n" + ("Ok Links: " + res.Ok) + "\n" + ("Broken Links: " + res.Broken))
  }
}).catch(err => {
  console.log(err.message)
});*/