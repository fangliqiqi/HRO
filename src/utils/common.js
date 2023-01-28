import Vue from "vue";
import { areaTrees } from '@/api/api'
import { PERMISSION_BUTTON } from '@/store/mutation-types'

export function forEachLinkName(menus, menuNames) {
  for (let object of menus) {
    let obj = new Object();
    obj.linkName = object.name;
    obj.id = object.id;
    menuNames.push(obj)
    if (object.children && object.children.length > 0) {
      forEachLinkName(object.children, menuNames);
    }
  }
  return menuNames;
}

/**
 * 根据id递归查找对应的name
 * @param {*} tree 
 * @param {*} key
 */
let res
export function searchFromTree(tree,key){
  for(let item of tree){
    if(item.id == key){
      res = item.name
      break
    }
    if(item.children && item.children.length > 0){
      searchFromTree(item.children,key)
    }else{
      continue
    }
  }
  return res
}

/**
 * 通用方法
 * 根据传递属性值递归查找对应的属性名
 * @param {*} tree 树形结构数组
 * @param {*} value 查找的值
 * @param {*} attrName 对应查找的属性值
 * @param {*} name 对应查找的属性名
 */
let resTit = ''
export function getNameFromTree(tree,value,attrName,name){
  for(let item of tree){
    if(item[attrName] == value){
      resTit = item[name]
      break
    }
    if(item.children && item.children.length > 0){
      getNameFromTree(item.children,value,attrName,name)
    }else{
      continue
    }
  }
  return resTit
}

/**
 * 通用方法 根据传递的属性值查找对应指定的属性值
 * @param {*} arr 数组
 * @param {*} value 传递的属性值
 * @param {*} attrName 对比的属性名
 * @param {*} name 查找的属性名
 */
export function getNameFromArr(arr,value,attrName,name){
  for(let item of arr){
    if(item[attrName] == value){
      return item[name]
    }
  }
}

/**
 * 重新组合树形结构
 * @param {*} tree 
 */
export function reTree(tree){
  for(let [index,item] of tree.entries()){
    if(item.children && item.children.length > 0){
      tree[index].disableCheckbox = true
      reTree(item.children)
    }else{
      tree[index].disableCheckbox = false
    }
  }
  return tree
}

export function getMultiName(list,separatrix,first,second,third){
  let name = {first:'',second:'',third:''}
  list.forEach(item=>{
    if(item.id == first){
      name.first = item.label
    }
    if(item.id == second){
      name.second = item.label
    }
    if(item.id == third){
      name.third = item.label
    }
  })
  let nameList = Object.values(name).filter(item=>item&&item.trim())
  return nameList.join(separatrix)
}

/**
 * 根据省市区id返回对应的名称
 * @param {省id} province 
 * @param {市id} city 
 * @param {县id} town 
 * @param {分隔符} separatrix 
 */
export function getAreaName(province, city, town, separatrix = "-") {
  let tree = getAreaData() || []
  let name = ''

  if (province) { // 省
    for (let first of tree) {
      if (first.id == province) {
        name += first.areaName

        if (city && first.children) { // 市
          for (let second of first.children) {
            if (second.id == city) {
              name += separatrix + second.areaName

              if (town && second.children) {  // 区、县
                for (let third of second.children) {
                  if (third.id == town) {
                    name += separatrix + third.areaName
                    break
                  }
                }
              }

              break
            }
          }
        }

        break
      }
    }
  }
  return name
}

export function getAreaFieldName(province, city, town,index){
  let tree = getAreaData() || []
  let name = []

  if (province) { // 省
    for (let first of tree) {
      if (first.id == province) {
        name.push(first.areaName)

        if (city && first.children) { // 市
          for (let second of first.children) {
            if (second.id == city) {
              name.push(second.areaName)
              if (town && second.children) {  // 区、县
                for (let third of second.children) {
                  if (third.id == town) {
                    name.push(third.areaName)
                    break
                  }
                }
              }

              break
            }
          }
        }

        break
      }
    }
  }
  
  return name[index]
}

export function getAreaData(){
  if(!Vue.ls.get('glob_area')){
    areaTrees().then((res)=>{
      if(Number(res.code) === 200) {
        Vue.ls.set('glob_area', res.data)
        return res.data
      }else{
        this.$message.warning('省市区数据为空');
      }
    })
  }else{
    return Vue.ls.get('glob_area')
  }
}

/**
 * 格式化流程图参数
 * @param {节点信息} data 
 */
export function formateSourceNode(data,id){
  let dataSource = {
    edges:[],
    nodes:[],
  }
  dataSource.nodes = data.processNodeList.map((item)=>{
    return {
      id:item.logoTitle,
      tid:item.id,
      label:item.name,
      x:parseFloat(item.coordinatex),
      y:parseFloat(item.coordinatey),
      nodetype:item.type,
      shape:item.shape,
      size:item.size,
      handleAllowNext:item.handleAllowNext,
      description:item.description,
      countersign:item.countersign,
      color:item.color,
      backType:item.backType,
      allowThis:item.allowThis,
      allowDispatch:item.allowDispatch,
      processId:id,
      nodePrimissionList:item.nodePrimissionList,
      nodeReaderPromissionList:item.nodeReaderPromissionList,
    }
  })
  dataSource.edges = data.nodeRouteList.map((item)=>{
    return {
      label:item.name,
      source:item.prewNode,
      sourceAnchor:Number(item.preNodeAnchor),
      target:item.nextNode,
      targetAnchor:Number(item.nextNodeAnchor),
      id:item.id,
      logoTitle:item.logoTitle,
      // tid:item.id,
      processId:id,
      description:item.description,
      opinion:item.opinion,
      opinionMustFlag:item.opinionMustFlag,
      priorityFlag:item.priorityFlag,
      routeType:item.routeType,
      sameForPrew:item.sameForPrew,
      sequenceNo:item.sequenceNo,
      shape:item.shape || 'flow-polyline',
      timeoutRoam:item.timeoutRoam,
    }
  })
  return dataSource
}

// 将标准时间转为指定格式
export function translateDateTime(time,format){
  const tf = function(i){return (i < 10 ? '0' : '') + i};
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, function(a){
    switch(a){
      case 'YYYY':
          return tf(time.getFullYear());
      case 'MM':
          return tf(time.getMonth() + 1);
      case 'mm':
          return tf(time.getMinutes());
      case 'DD':
          return tf(time.getDate());
      case 'HH':
          return tf(time.getHours());
      case 'ss':
          return tf(time.getSeconds());
    }
  })
}
/**
 * 处理导入数据
 * @param {*} data 
 */
export function handleImportData(data,format="YYYY-MM-DD"){
  // 去除空格
  const newData = data.map(item=>{
    const obj = {}
    for(const key in item){
      const newKey = (typeof(key)==='string') ? key.trim() : key
      obj[newKey] = (typeof(item[key])==='string') ? item[key].trim() : item[key]
      if(obj[newKey]&&typeof(obj[newKey])==='string'){
        // eslint-disable-next-line
        obj[newKey] = obj[newKey].replace(/^\`/,'')
      }
      if(/是否需要电子签/.test(newKey)){
        obj[newKey] = (obj[newKey] == '需要电子签') ? 1 : 0
      }
      if(RegExp(/入账时间/).test(newKey) && typeof(obj[newKey]) === "number"){
        obj[newKey] = formatExcelDate(obj[newKey],'-')
      }
      // 判断是否为日期
      if(obj[newKey] instanceof Date){
        obj[newKey] = translateDateTime(obj[newKey],format)
      }
      if(obj[newKey] === ''){
        delete obj[newKey]
      }
    }
    return obj
  })

  // 去除最后的空格行
  for (let i=(newData.length-1); i>=0; i--) {
    // 判断数组是否全为空
    const flag = Object.values(newData[i]).find(item=>{
      return String(item).replace(/^\s*|\s*$/g,"").length
    })
    if(!flag){
      newData.splice(i, 1)
    }else{
      break
    }
  }
  return newData
}

/**
 * 处理导入信息
 * @param {*} data 
 */
 export function handleImportFail(data){
   // 去除空格
  const newData = data.map(item=>{
    const obj = {}
    for(const key in item){
      const newKey = (typeof(key)==='string') ? key.trim() : key
      obj[newKey] = (typeof(item[key])==='string') ? item[key].trim() : item[key]

      if(/EMPTY/.test(newKey)){
        delete obj[newKey]
      }
    }
    return obj
  })
  // 去除最后的空格行
  for (let i=(newData.length-1); i>=0; i--) {
    // 判断数组是否全为空
    const flag = Object.values(newData[i]).find(item=>{
      return String(item).replace(/^\s*|\s*$/g,"").length
    })
    if(!flag){
      newData.splice(i, 1)
    }else{
      break
    }
  }
  return newData
}

/**
 * 将业务类型转成树形结构
 * @param {*} allTypeList 
 * @returns 
 */
// 获取所有类型
export function getAllTree(allTypeList) {
  // 通过info建立了id=>node的映射
  let info = allTypeList.reduce((map, node) => {
    return map[node.id] = node, node.children = [], map
  }, {})
  // 最后arr就是我们转换成功的树结构
  const arr = allTypeList.filter(node => {
    if (info[node.parentId]) {
      // 将对应的node放入对应的对象里面去，因为它是浅拷贝，所以会影响原来的数组
      info[node.parentId].children.push(node)
    }
    // 将没parentId的node返回组成一个新数组 没有parentId代表着它是根元素
    return node.parentId < 0  // 为 true会返回这个数据，为false则不会返回
  })
  return arr
}

/**
 * 获取薪资自定义项名称
 * @param {*} type 
 * @param {*} name 
 */
export function getItemName(type,name,ispause=null){
  let str = ''
  if(type !== null){
    str += type
  }
  if(name !== null){
    if(str){
      str += '-'+name
    }else{
      str += name
    }
  }
  if(ispause){
    if(Number(ispause)==1){
      str += '(暂停发)'
    }else if(Number(ispause)==2){
      str += '(不发放)'
    }
  }
  return str
}

/**
 * 获取随机字符串
 * @param {位数} e 
 */
export function randomString(e) {  
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
  a = t.length,
  n = "";
  for (let i = 0; i < e; i++){
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}

/**
 * 2020年10月28日是44132。根据度娘得知Excel存储的日期是从1900年1月1日开始按天数来计算的，也就是说1900年1月1日在Excel中是1
 * 因为时间戳是从1970年1月1日算起的（时间戳为0的时候是1970年1月1日）也就是说new Date(0).toLocaleDateString('zh')的值是1970/1/1。
而1970年1月1日这一天在Excel中是25569，那就令从Excel中获取到的值减去25569，然后再乘以24*60*60*1000获取到这一天的毫秒数，再new Date(这个毫秒数)就能得到转换后的日期了。
既然60之前相差一天 那就做个判断 <60的时候 多减去一天
 * @param {excel中显示的天数} num 
 * @param {分隔符} format 
 */
export function formatExcelDate(num, format="-") {
  num = Number(num);	// 强制类型转化，以防传来的值是字符串
  let millisecond = 0;	// 转化后的毫秒数
  if (num > 60) {
    millisecond = (num - 25569) * 60 * 60 * 24 * 1000;
  } else { // 对小于61的错误日期进行处理
    millisecond = (num - 25568) * 60 * 60 * 24 * 1000;
  }
  let date = new Date(millisecond);	// 根据转化后的毫秒数获取对应的时间
  let yy = date.getFullYear();
  let mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  let dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return yy + format + mm + format + dd;	// 返回格式化后的日期
}

// 精度处理
export function formatFloat(f, digit = 2) {
  const m = Math.pow(10, digit)
  return Math.round(f * m) / m
}

// 获取dpi
export function getDpi() {
  for (var i = 56; i < 2000; i++) {
    if (matchMedia("(max-resolution: " + i + "dpi)").matches === true) {
      return i;
    }
  }
}

// 禁止右击
export function disableRightClick(){
  document.oncontextmenu = function() {
    return false;
  }
}

// 禁止快捷键打印
export function disablePrintShortcut(){
  if(event.ctrlKey && event.keyCode == 80){
    event.returnValue=false;
  }
}

export function insertAfter(ele,html){
  var new_ele = document.createElement("div");
  new_ele.innerHTML = html;
  var parent = ele.parentNode || document.body;
  parent.insertBefore(new_ele.firstChild, ele.nextSibling);
}

// 判断页面缩放情况
export function detectZoom(){
  let ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase();
  if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
  }
  else if (~ua.indexOf('msie')) { 
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  }
  else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  } 
  if (ratio){
    ratio = Math.round(ratio * 100);
  }
  return ratio;
}

// 判断用户是否有指定权限
export function hasOperatePermission(str){
  const permissionButton = Vue.ls.get(PERMISSION_BUTTON);
  const res = permissionButton.find(item=>item.action === str)
  return res ? true : false;
}

// 限制只能输入金额
export function limitAccount(val){
  // eslint-disable-next-line
  let value = val.replace(/[^(\d|\-)\.]/g,'');
  value = value.replace(/^\./g,'');
  value = value.replace(/\.{2,}/g,'.');
  value = value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
  // eslint-disable-next-line
  return value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
}

// 数组对象根据指定字段分组
export function groupByField(arr,field){
  return arr.reduce((pre, item) => {
    pre[item[field]] = pre[item[field]] || [];
    pre[item[field]].push(item);
    return pre;
  }, {});
}

// 数组对象获取相同id的个数
export function groupByRepetid(arr,id){
  return arr.reduce((pre, item) => {
    pre[item[id]] = pre[item[id]]?++pre[item[id]]:1;
    return pre;
  }, {});
}