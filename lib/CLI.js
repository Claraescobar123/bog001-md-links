//What is this? #!/usr/bin/env node
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
console.log(firstOption,secondOption) 

//Opciones
let options = {
  validate: false,
  stats: false
}

//Si el usuario ingresa la opción 'validate',cambia a verdadero
if (firstOption === '--validate' || secondOption === '--validate') {
  options.validate = true;
  console.log('VALIDATE',options.validate);
} 
//Si el usuario ingresa la opción 'stats',cambia a verdadero
if (firstOption === '--stats' || secondOption === '--stats') {
  options.stats = true; 
  console.log('STATS',options.stats);
}

//Si no ingresa ningun archivo, que le pida al usuario porfavor ingresar

//Después imprimir en consola
mdLinks(route, options)
.then (console.log)
