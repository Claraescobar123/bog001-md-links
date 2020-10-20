//modulo fs leer archivo texto plano, utilizando node js
//importación modulo fs utilizando require
//path lee archivos con extensión md
//File System
const fs = require('fs');
const path = require('path');
const archivo = './README.md';
//const extension = path.extname(archivo);
const absolute = path.resolve(archivo);
const marked = require('marked');


//Pasar la ruta de relativa a absoluta
/*function changePath (){
  return path.resolve(archivo);
}*/

//Validar la extension del archivo
/*function pathValidate(file){
  if (path.extname(file) === '.md'){
    console.log('true')
    //return true;
  } else {
    console.log('false')
    //return false;
  }
}
pathValidate(archivo);*/

//Leer un archivo
/*fs.readFile('contenido.txt', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  console.log(data);
});*/

//
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

//Si un archivo existe
fs.stat(archivo, function(err) {
  if (err == null) {
    console.log("El archivo existe");
  } else if (err.code == 'ENOENT') {
    console.log("el archivo no existe");
  } else {
    console.log(err); // ocurrió algún error
  }
})

//Si es archivo o directorio
const fileOrDirectory = (route) => {
  const files = [];
  if (path.extname(route) === '.md') {
      files.push(route)
      return files
  } else {
      const directory = fs.readdir(route)
      const filterMd = directory.filter(file => path.extname(file) === '.md')
      filterMd.forEach((elem) => {
          const validFiles = path.join(route, elem);
          files.push(validFiles)
      })
      return files
  }
}
console.log(fileOrDirectory(absolute));

//Obteniendo los links 
const searchLinks = (route => {
  return new Promise((resolve, reject) => {
    readFile(route).then(res => {
      let links = [];
      const renderer = new marked.Renderer();
      renderer.link = function(href,title,text){
          links.push({
            // Url encontrada.
            href:href,
            // Texto que aparece acompañando al link.
            text:text,
            // Ruta del archivo donde se encontró el link.
            file:path})  
      } 
        marked(res,{renderer:renderer}); 
        resolve(links)
    })
    .catch(err => {
      reject(err)
      })
  })
})
searchLinks(absolute)
.then((links)=>{
  console.log(links)
}).catch((error)=>{
  console.log(error)
})


//crear variable con el array que me devuelve la anterior funcion, y esta variable la utilizo para seguir
//con extraccion de links
//module.exports = readFile(), pathValidate(), changePath();
