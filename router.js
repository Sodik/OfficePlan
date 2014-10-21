module.exports = function(handlers, pathName, res, req){
  console.log(pathName)
  if(typeof handlers[pathName] === 'function'){
    handlers[pathName](res, req);
  }else{
    console.log('No handlers found');
  }
}