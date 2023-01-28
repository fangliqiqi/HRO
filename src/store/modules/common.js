import Vue from 'vue'

import {areaTrees} from '@/api/api'

const common = {
  state: {
    areas: [],
  },

  mutations: {
    // eslint-disable-next-line
    SET_AREA: (state, areas) => {
      // eslint-disable-next-line
      state.glob_area = token
    },
  },

  actions: {
    // 加载Area数据
    GetSysAreaList({ commit }) {
      return new Promise((resolve, reject) => {
        areaTrees().then((res)=>{
          if(Number(res.code) === 200) {
            Vue.ls.set('glob_area', res.data)
            commit('SET_AREA', res.data)
          }
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
  }
}

export default common