import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter,
    headers: {
      //'Authorization': 'yifu YW5odWl3YW54aW5ocm1zOmFuaHVpd2FueGluaHJtcw==', anhuiwanxinhrms:anhuiwanxinhrms
      'Authorization': 'yifu d3hocjp0aGlzaXN3eGhy',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}

/**
 * 获取登录时间戳
 * @returns {*}
 */
export function timeStamp() {
  return axios({
    url: '/getTimeStamp',
    method: 'GET'
  })
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return axios({
    url: '/admin/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout() {
  return axios({
    url: '/auth/oauth/removeToken',
    method: 'post'
  })
}