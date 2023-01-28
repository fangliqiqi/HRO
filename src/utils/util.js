import {
  isURL
} from '@/utils/validate'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = []
  let index = Math.floor((Math.random() * arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 金额格式化
 * @param num
 */
export function numFormat(num) {
  var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  var regPos = /^\d+(\.\d+)?$/
  if (regPos.test(value)) {
    //如果是数字
    let getDate = new Date(value)
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  } else {
    //TODO
    value = value.trim()
    return value.substr(0, fmt.length)
  }
}

// 生成首页路由
export function generateIndexRouter(data) {
  let indexRouter = [{
    path: '/',
    name: 'dashboard',
    //component: () => import('@/components/layouts/BasicLayout'),
    component: resolve => require(['@/components/layouts/TabLayout'], resolve),
    meta: {
      title: '首页'
    },
    redirect: '/dashboard/analysis',
    children: [
      ...generateChildRouters(data)
    ]
  }, {
    'path': '*',
    'redirect': '/404',
    'hidden': true
  }]
  return indexRouter
}

// 生成嵌套路由（子路由）

function generateChildRouters(data) {
  const routers = []
  for (var item of data) {
    let component = ''
    if (item.component.indexOf('layouts') >= 0) {
      component = 'components/' + item.component
    } else {
      component = 'views/' + item.component
    }

    // eslint-disable-next-line
    let URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      item.meta.url = URL
    }

    let menu = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: resolve => require(['@/' + component + '.vue'], resolve),
      hidden: item.hidden,
      //component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList
      }
    }
    if (item.alwaysShow) {
      menu.alwaysShow = true
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)]
    }
    //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    //判断是否生成路由
    if (item.route && item.route === '0') {
      console.log(item.route + " 不生成路由!")
    } else {
      routers.push(menu)
    }
    //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
  }
  return routers
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 随机生成数字
 * @param min 最小值
 * @param max 最大值
 * @return int 生成后的数字
 */
export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
  let chats = '0123456789abcdef'
  return randomString(32, chats)
}

/**
 * 生成VUE菜单结构
 * @param menu
 */
export function toVueMenuTree(menuData) {
  let permissionButton = [];
  if (menuData && menuData.length > 0) {
    for (var i = 0; i < menuData.length; i++) {
      let permissionListTwo = [];
      if (menuData[i].parentId == -1) {
        if (menuData[i].children.length == 0) {
          delete menuData[i].children;
        } else {
          //二级菜单
          for (var j = 0; j < menuData[i].children.length; j++) {
            //处理按钮
            if (menuData[i].children[j].type == 1) {
              let buttonObj = {};
              buttonObj.action = menuData[i].children[j].component;
              buttonObj.describe = menuData[i].children[j].name;
              permissionListTwo.push(buttonObj);
              permissionButton.push(buttonObj) // yhy 用于判断独立权限
              menuData[i].children.splice(j, 1);
              j--;
            }
          }

          for (let j = 0; j < menuData[i].children.length; j++) {
            let permissionListThree = [];
            //三级菜单
            if (menuData[i].children[j].children.length > 0) {
              for (var k = 0; k < menuData[i].children[j].children.length; k++) {
                //处理按钮
                if (menuData[i].children[j].children[k].type == 1) {
                  let buttonObj = {};
                  buttonObj.action = menuData[i].children[j].children[k].component;
                  buttonObj.describe = menuData[i].children[j].children[k].name;
                  permissionListThree.push(buttonObj);
                  permissionButton.push(buttonObj) // yhy 用于判断独立权限
                  menuData[i].children[j].children.splice(k, 1);
                  k--;
                }
              }

              for (let k = 0; k < menuData[i].children[j].children.length; k++) {
                let permissionListFour = [];
                if (menuData[i].children[j].children[k].children.length > 0) {
                  for (var l = 0; l < menuData[i].children[j].children[k].children.length; l++) {
                    if (menuData[i].children[j].children[k].children[l].type == 1) {
                      let buttonObj = {};
                      buttonObj.action = menuData[i].children[j].children[k].children[l].component;
                      buttonObj.describe = menuData[i].children[j].children[k].children[l].name;
                      permissionListFour.push(buttonObj);
                      permissionButton.push(buttonObj)  // yhy 用于判断独立权限
                      menuData[i].children[j].children[k].children.splice(l, 1);
                      l--;
                    }
                  }
                }
                menuData[i].children[j].children[k].meta["permissionList"] = permissionListFour;
              }

              for (let k = 0; k < menuData[i].children[j].children.length; k++) {
                if (menuData[i].children[j].children[k].meta.keepAlive == 0) {
                  menuData[i].children[j].children[k].meta.keepAlive = 'true';
                }
                if (menuData[i].children[j].children[k].meta.title == 'dashboard-analysis') {
                  menuData[i].children[j].children[k].meta.title = '首页';
                }
                menuData[i].children[j].children[k].path = menuData[i].children[j].children[k].url;
                delete menuData[i].children[j].children[k].url
                delete menuData[i].children[j].children[k].label;
                delete menuData[i].children[j].children[k].disabled;
                // delete menuData[i].children[j].children[k].parentId;
                delete menuData[i].children[j].children[k].subMenus;
                delete menuData[i].children[j].children[k].icon;
                delete menuData[i].children[j].children[k].authority;
                delete menuData[i].children[j].children[k].type;
                // delete menuData[i].children[j].children[k].sort;
                delete menuData[i].children[j].children[k].alwaysShow;
              }
            }

            if (menuData[i].children[j].meta.keepAlive == 0) {
              menuData[i].children[j].meta.keepAlive = 'true';
            }
            if (menuData[i].children[j].meta.title == 'dashboard-analysis') {
              menuData[i].children[j].meta.title = '首页';
            }
            menuData[i].children[j].meta["permissionList"] = permissionListThree;
            menuData[i].children[j].path = menuData[i].children[j].url;
            delete menuData[i].children[j].url
            delete menuData[i].children[j].label;
            delete menuData[i].children[j].disabled;
            // delete menuData[i].children[j].parentId;
            delete menuData[i].children[j].subMenus;
            delete menuData[i].children[j].icon;
            delete menuData[i].children[j].authority;
            delete menuData[i].children[j].type;
            // delete menuData[i].children[j].sort;
            delete menuData[i].children[j].alwaysShow;
          }
        }
      }
      //deleteMenuProperty(menuData[i])
      if (menuData[i].meta.keepAlive == 0) {
        menuData[i].meta.keepAlive = 'true';
      }
      if (menuData[i].meta.title == 'dashboard-analysis') {
        menuData[i].meta.title = '首页';
      }
      menuData[i].meta["permissionList"] = permissionListTwo;
      menuData[i].path = menuData[i].url;
      delete menuData[i].url
      delete menuData[i].label;
      delete menuData[i].disabled;
      // delete menuData[i].parentId;
      delete menuData[i].subMenus;
      delete menuData[i].icon;
      delete menuData[i].authority;
      delete menuData[i].type;
      delete menuData[i].alwaysShow;
    }

    for (let i = 0; i < menuData.length; i++) {
      if (menuData[i].children) {
        if (menuData[i].children.length == 0) {
          delete menuData[i].children;
        } else {
          for (let j = 0; j < menuData[i].children.length; j++) {
            if (menuData[i].children[j].children && menuData[i].children[j].children.length == 0) {
              delete menuData[i].children[j].children;
            } else {
              for (let k = 0; k < menuData[i].children[j].children.length; k++) {
                if (menuData[i].children[j].children[k].children.length == 0) {
                  delete menuData[i].children[j].children[k].children;
                }
              }
            }
          }
        }
      }
    }
  }
  return permissionButton;
}

/**
 * 【顶部导航栏模式】
 *  @date 2019-04-08
 *  顶部导航栏滚动条位置滚动到选中的菜单处
 * @param doc document 对象
 */
export function topNavScrollToSelectItem(doc) {
  let scrollWidth = doc.getElementById('top-nav-scroll-width')
  if (scrollWidth == null) return
  let menu = scrollWidth.getElementsByClassName('ant-menu')[0]
  if (menu) {
    let menuItems = menu.getElementsByTagName('li')
    for (let item of menuItems) {
      let index1 = item.className.indexOf('ant-menu-item-selected') !== -1
      let index2 = item.className.indexOf('ant-menu-submenu-selected') !== -1
      if (index1 || index2) {
        // scrollLeft = 选中项left - 选中项width - (第一个隐藏的div的宽度)
        let scrollLeft = (item.offsetLeft - item.offsetWidth - (index1 ? 100 : 60))
        let scrollView = doc.getElementById('top-nav-scroll-view')
        // scrollTo() 方法存在兼容性问题
        if (typeof scrollView.scrollTo === 'function') {
          scrollView.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          })
        } else {
          scrollView.scrollLeft = scrollLeft
        }
        break
      }
    }
  }
}
/**
 * 
 *  人民币金额转大写汉字
 * @param n 金额数字
 */
export function RMBChanageChinese(n) {
  if (n == 0) {
    return '零'
  }
  if (!/^(\+|-)?(0|[1-9]\d*)(\.\d+)?$/.test(n)) return ''
  var unit = '仟佰拾亿仟佰拾万仟佰拾元角分',
    str = ''
  n += '00'
  var a = parseFloat(n)
  if (a < 0) {
    n = n.substr(1)
  }
  var p = n.indexOf('.')
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2)
  }
  unit = unit.substr(unit.length - n.length)
  for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
  if (a > 0) {
    return str
      .replace(/零(仟|佰|拾|角)/g, '零')
      .replace(/(零)+/g, '零')
      .replace(/零(万|亿|元)/g, '$1')
      .replace(/(亿)万|壹(拾)/g, '$1$2')
      .replace(/^元零?|零分/g, '')
      .replace(/元$/g, '元整')
  } else {
    return (
      '负' +
      str
        .replace(/零(仟|佰|拾|角)/g, '零')
        .replace(/(零)+/g, '零')
        .replace(/零(万|亿|元)/g, '$1')
        .replace(/(亿)万|壹(拾)/g, '$1$2')
        .replace(/^元零?|零分/g, '')
        .replace(/元$/g, '元整')
    )
  }
}

/**
 * 
 *  防抖函数
 * @param n 金额数字
 */

 let timer = null;
 export const debounce = (fn,wait,val) => {
   if(timer !== null){
     clearTimeout(timer);
   }
   timer = setTimeout(function(){fn.call(this, val);timer = null;},wait);
 }

 