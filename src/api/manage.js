import { axios } from '@/utils/request'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
const qs = require('qs');

const api = {
  user: '/api/user',
  role: '/api/role',
  service: '/api/service',
  permission: '/api/permission',
  permissionNoPager: '/api/permission/no-pager'
}

export default api

//post
export function postAction(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    data: parameter
  })
}

//post
export function postActionHeader(url, parameter, header, timeout) {
  return axios({
    url: url,
    method: 'post',
    data: parameter,
    headers: header,
    timeout: (timeout ? timeout : 120000),
  })
}

//post || put
export function httpActionHeader(url, parameter, method, header, timeout) {
  return axios({
    url: url,
    method: method,
    data: parameter,
    headers: header,
    timeout: (timeout ? timeout : 120000),
  })
}

//post method= {post | put}
export function httpAction(url, parameter, method, timeout) {
  return axios({
    url: url,
    method: method,
    data: parameter,
    timeout: (timeout ? timeout : 120000),
    paramsSerializer: function (parameter) {
      return qs.stringify(parameter, { arrayFormat: 'repeat' })
    },
  })
}

//put
export function putAction(url, parameter) {
  return axios({
    url: url,
    method: 'put',
    data: parameter
  })
}

//get
export function getAction(url, parameter, timeout) {

  var access_token = Vue.ls.get(ACCESS_TOKEN).access_token
  return axios({
    url: url,
    method: 'GET',
    params: parameter,
    timeout: (timeout ? timeout : 120000),
    paramsSerializer: function (parameter) {
      return qs.stringify(parameter, { arrayFormat: 'repeat' })
    },
    headers: {
      'Authorization': access_token
    }
  })
}

//deleteAction
export function deleteAction(url, parameter) {
  return axios({
    url: url,
    method: 'delete',
    params: { parameter }
  })
}

export function getUserList(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList(parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: api.service,
    method: parameter.id == 0 ? 'post' : 'put',
    data: parameter
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter, timeout) {
  return axios({
    url: url,
    params: parameter,
    method: 'get',
    timeout: (timeout ? timeout : 300000),
    responseType: 'blob'
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFilePost(url, parameter, timeout) {
  return axios({
    url: url,
    method: 'post',
    data: parameter,
    timeout: (timeout ? timeout : 300000),
    responseType: 'blob'
  })
}

