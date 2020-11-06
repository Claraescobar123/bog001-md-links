//modulo fs leer archivo texto plano, utilizando node js
//importación modulo fs utilizando require
//path lee archivos con extensión md
//File System
const fs = require('fs');
const path = require('path');
const archivo = './prueba.md';
//Pasar la ruta de relativa a absoluta
const absolute = path.resolve(archivo);
const marked = require('marked');
const fetch = require('node-fetch');
const { resolve } = require('path');


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

/*readFile(absolute)
.then((data) => {
  console.log(data)
}).catch((error)=>{
  console.log(error)
})*/


//Si un archivo existe, llamar en otra función
/*fs.stat(archivo, function(err) {
  if (err == null) {
    console.log("El archivo existe");
  } else if (err.code == 'ENOENT') {
    console.log("el archivo no existe");
  } else {
    console.log(err); // ocurrió algún error
  }
})*/

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
//console.log(fileOrDirectory(absolute));

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
            file:route})  
      } 
        marked(res,{renderer:renderer}); 
        resolve(links)
    })
    .catch(err => {
      reject(err)
      console.log('No se encuentran links')
      })
  })
})
/*searchLinks(absolute)
.then((links)=>{
  console.log(links)
}).catch((error)=>{
  console.log(error)
})*/

//Validación de links
const validateLinks = (route) => {
  return new Promise((resolve, reject) => {
    searchLinks(route)
    .then(links => { 
      let fetchLinks = links.map(element => {  
        return fetch(element.href)
        .then(res => {
          if (res.status > 299) {
            element.statusCode = res.status;
            element.status = "FAIL";
          } else {
            element.statusCode = res.status;
            element.status = "OK";
          }
        })
        .catch((err) => {
          element.status = err.code;
          //Averiguar status code 500
          element.statusCode = 500;
        }) 
    })
      Promise.all(fetchLinks).then( res => {
          resolve(links);
      })
    })
    .catch(err=>{
      reject(err);
    })
  })
}
/*validateLinks(absolute)
.then((links)=>{
  console.log(links);
}).catch((error)=>{
  console.log(error);
})*/

//Estadisticas de Links
const statsLinks = (route) => {
  return new Promise((resolve, reject) => { 
    searchLinks(route)
    .then(links => {
      const uniqueLinks = new Set(links.map(element => element.href))
      resolve({
        total:links.length,
        unique : uniqueLinks.size
      })
    })
    .catch(err => {
      reject(err)
    })
  })
  }
/*statsLinks(absolute)
.then((links)=>{
  console.log(links);
}).catch((error)=>{
  console.log(error);
})*/

//Union de validación de links y estadisticas 
const statsAndValidateLinks = (route) => {
  return new Promise((resolve,reject) => {
    validateLinks(route).then(links => {
      const statusLinks = links.map(element => element.status)
      const totalLinks = links.length;
      //Las expresiones regulares son patrones que se utilizan para hacer coincidir combinaciones de caracteres en cadenas. En JavaScript, las expresiones regulares también son objetos.
      //Método .match() Devuelve un arreglo que contiene todas las coincidencias, incluidos los grupos de captura, o null si no se encuentra ninguna coincidencia.
      //El modificador g se utiliza para realizar una coincidencia global
      let okLinks = statusLinks.toString().match(/OK/g)
      if(okLinks != null){
        okLinks = okLinks.length
      }else{
        okLinks =  0
      }
      //Tratar de probar con links rotos
      let brokenLinks = statusLinks.toString().match(/FAIL/g)
      if(brokenLinks != null){
        brokenLinks = brokenLinks.length
      }else{
        brokenLinks =  0
      }
      
        resolve({
        total: totalLinks,
        ok: okLinks,
        broken: brokenLinks
      })
    }).catch(err=>{
      reject(err)
    })
  })
}
/*statsAndValidateLinks(absolute)
.then((links)=>{
  console.log(links);
}).catch((error)=>{
  console.log(error);
})*/

//Función de mdLinks

  const mdLinks = (route, options) => {
    return new Promise((resolve, reject) => {
        const getFiles = fileOrDirectory(route);
        let result = getFiles.map((elem) => {
            if (options.validate && !options.stats) {
                return validateLinks(elem);
            } else if (options.stats && !options.validate) {
                return statsLinks(elem);
            } else if (options.validate && options.stats) {
                return statsAndValidateLinks(elem);
            } else if (options) {
                return searchLinks(elem);
            }
        })
//Con el apply()método, puede escribir un método que se pueda utilizar en diferentes objetos.
        Promise.all(result).then((res) => {
            let resultArray = [].concat.apply([], res);
            resolve(resultArray);
        }).catch(err => {
            reject(err)
        })
    })
  
}
/*mdLinks(absolute,{validate:true})
  .then(console.log).catch(console.log);*/

module.exports = {mdLinks};