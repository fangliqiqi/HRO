/**
 * 遍历对象的属性和属性值
 * @param obj
 */
export function allPrpos(obj) {
  for(var p in obj){
    if(typeof(obj[p]) == "function"){
      obj[p]();
    } else {
      // p 为属性名称，obj[p]为对应属性的值
      if(obj[p] != undefined) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 去除对象的undefined
 * @param {对象} obj 
 */
export function clearUnde(obj) {
  for(var item in obj){
    if(obj[item] == undefined){
      obj[item] = null
    }
  }
  return obj
}