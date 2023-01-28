import Vue from 'vue'
import { login, logout, timeStamp } from '@/api/login'
import { ACCESS_TOKEN, USER_NAME, USER_INFO, USER_PERMISSION, PERMISSION_BUTTON } from '@/store/mutation-types'
import { welcome, toVueMenuTree } from '@/utils/util'
import { queryPermissionsByUser,areaTrees } from '@/api/api'
import { encrypt, format } from "@/utils/aes"
//import { GLOB_CACHE } from "@/store/cache"

const user = {
  state: {
    token: '',
    username: '',
    realname: '',
    welcome: '',
    avatar: '',
    permissionList: [],
    permissionButton: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { username, realname, welcome }) => {
      state.username = username
      state.realname = realname
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_PERMISSIONBUTTON: (state, permissionButton) => {
      state.permissionButton = permissionButton
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        let formData = new FormData()

        //执行登录前的前置动作
        timeStamp().then(response => {
          var data = String(response);
          var one = parseInt(data.charAt(data.length - 1)) == 0 ? 1 : parseInt(data.charAt(data.length - 1));
          var two = parseInt(data.charAt(data.length - 2)) < one ? parseInt(data.charAt(data.length - 2)) : 0;
          var three = data.substring(two, one);

          formData.append('password', encrypt(three + userInfo.password, format(two + one + three)));
          formData.append('timeStamp', data);
          formData.append('username', userInfo.username);

          //执行登录
          login(formData).then(resp => {
            if (resp.data != null) {
              let token = resp.data.oauth2AccessToken;
              Vue.ls.set(ACCESS_TOKEN, token, token.expires_in * 1000)
              //用户信息
              let user = resp.data.user;
              Vue.ls.set(USER_INFO, user, token.expires_in * 1000)
              Vue.ls.set(USER_PERMISSION, user.authorities, token.expires_in * 1000)
              // 省市区数据
              if(!Vue.ls.get('glob_area')){
                areaTrees().then((res)=>{
                  if(Number(res.code) === 200) {
                    Vue.ls.set('glob_area', res.data)
                  }
                })
              }

              commit('SET_TOKEN', token)
              commit('SET_INFO', user)
              commit('SET_NAME', { username: user.username, realname: user.nickName, welcome: welcome() })
              commit('SET_AVATAR', user.avatar)

              //GLOB_CACHE.set(user);
              resolve()
            } else {
              reject(resp)
            }
          }).catch(error => {
            reject(error)
          })

        }).catch(error => {
          reject(error)
        });
      })
    },

    // 获取用户信息
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        let username = Vue.ls.get(USER_NAME)
        let params = { username: username }
        queryPermissionsByUser(params).then(response => {
          // console.log(response.data);
          const menuData = response.data
          if (menuData && menuData.length > 0) {
            let permissionButton = toVueMenuTree(menuData);
            Vue.ls.set(PERMISSION_BUTTON, permissionButton)
            commit('SET_PERMISSIONLIST', menuData)
            commit('SET_PERMISSIONBUTTON', permissionButton)
          } else {
            reject('getPermissionList: permissions must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        let logoutToken = state.token
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONLIST', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(PERMISSION_BUTTON)
        //console.log('logoutToken: '+ logoutToken)
        logout(logoutToken).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user