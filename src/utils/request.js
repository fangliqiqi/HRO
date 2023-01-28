import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { Modal, notification } from 'ant-design-vue'
import { ACCESS_TOKEN, LOGIN_URL, USER_INFO } from "@/store/mutation-types"

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 20000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN);

    if (data.msg) {
      if(data.code){
        switch (data.code) {
          case 401:
          notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
          break
        default:
          notification.error({
            message: '系统提示',
            description: data.msg,
            duration: 4
          })
          break
        }
      }
    } else if (data.message) {
      notification.error({
        message: '系统提示',
        description: data.message,
        duration: 4
      })
    } else {
      switch (error.response.status) {
        case 429:
          console.log(666666)
          console.log(Date.parse(new Date()))
          notification.error({ message: '系统提示', description: '网络请求过多', duration: 4 })
          break
        case 403:
          console.log(888888)
          notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
          break
        case 417:
          notification.error({ message: '系统提示', description: 'ip被封，如若误伤请联系管理员！', duration: 4 })
          break
        case 500:
          //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
          if (token && data.message == "Token失效，请重新登录") {
            // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
            // store.dispatch('Logout').then(() => {
            //     window.location.reload()
            // })
            Modal.error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  window.location.reload()
                })
              }
            })
            // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
          }
          break
        case 404:
          notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
          break
        case 504:
          notification.error({ message: '系统提示', description: '网络超时' })
          break
        case 401:
          notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
          if (token) {
            store.dispatch('Logout').then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
          }
          break
        default:
          notification.error({
            message: '系统提示',
            description: "未知错误,请联系管理员",
            duration: 4
          })
          break
      }
    }
  } else if (error.request) {
    if (error.request.timeout != 3000) {
      if (error.request.readyState == 4 && error.request.status == 0) {
        notification.error({ message: '系统提示', description: '请求超时', duration: 4 })
      }
    }
  }

  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  const user = Vue.ls.get(USER_INFO)
  if (token && LOGIN_URL != config.url) {
    config.headers['Authorization'] = token.token_type + " " + token.access_token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    if (user.dbKey) {
      config.headers['orgCode'] = user.dbKey; // 分库请求
    }
  }
  if (config.method == 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}