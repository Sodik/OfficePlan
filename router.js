module.exports = function(handlers, pathName, response){
  console.log(pathName)
  if(typeof handlers[pathName] === 'function'){
    handlers[pathName](response);
  }else{
    console.log('No handlers found');
  }
}