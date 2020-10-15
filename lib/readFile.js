//modulo fs leer archivo texto plano, utilizando node js
//importación modulo fs utilizando require
//path lee archivos con extensión md
//File System
const fs = require('fs');
const path = require('path');
const archivo = './README.md';
const extension = path.extname(archivo);
const absolute = path.resolve(archivo);


//Pasar la ruta de relativa a absoluta
/*function changePath (){
  return path.resolve(archivo);
}

//Validar la extension del archivo
function pathValidate(){
  if (path.extname(archivo) === '.md'){
    return true;
  } else {
    return false;
  }
}*/

//Leer un archivo
/*fs.readFile('contenido.txt', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  console.log(data);
});*/

//se invoca el metodo readFile, lectura de archivos con nodejs asíncrono.
const readFile = (route) => {

  const promise = new Promise ((resolve, reject) => {
    fs.readFile(route, 'utf8', (err, data) => {
  
      if(err){
        reject('archivo invalido'); 
      }
      else{
        resolve(data);
      }
    });
  });
  return promise;
};
readFile(absolute)
.then((data)=>{
  console.log(data)
})

//Si un archivo existe
/*fs.stat('archivo', function(err) {
  if (err == null) {
    console.log("El archivo existe");
  } else if (err.code == 'ENOENT') {
    console.log("el archivo no existe");
  } else {
    console.log(err); // ocurrió algún error
  }
})*/

//module.exports = readFile(), pathValidate(), changePath();