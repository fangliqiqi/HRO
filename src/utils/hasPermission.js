import { PERMISSION_BUTTON } from "../store/mutation-types";
const hasPermission = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.directive('has', {
      inserted: (el, binding, vnode) => {
        let permissionList = vnode.context.$route.meta.permissionList;
        if (permissionList === null || permissionList === "" || permissionList === undefined) {
          el&&el.parentNode.removeChild(el)
          return
        }
        let permissions = [];
        for (var item of permissionList) {
          permissions.push(item.action);
        }
        // if (!permissions.includes(binding.value)) {
        //   el.parentNode.removeChild(el)
        // }
        // 兼容多个权限标识 | 分割
        const perArr = binding.value.split('|')
        let flag = false
        perArr.forEach(item => {
          if(permissions.includes(item)){
            flag = true
          }
        })
        if (!flag) {
          el&&el.parentNode.removeChild(el)
        }
      }
    })
    Vue.directive('have', { // 单独测试按钮权限
      inserted: (el, binding) => {
        const permissionButton = Vue.ls.get(PERMISSION_BUTTON)
        let permissions = [];
        for (var item of permissionButton) {
          permissions.push(item.action);
        }
        if (!permissions.includes(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
};

export default hasPermission;
