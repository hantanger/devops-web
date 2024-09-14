import { defineStore } from 'pinia'
import { toRaw } from 'vue'

// 如果已缓存，则从缓存读
const defaultState = {
  username: null,
  token: null,
  role: null,
  isCollapse: true, // 菜单折叠状态
}
const stateStr = localStorage.getItem('__user_store__')
const stateObj = stateStr
  ? Object.assign(defaultState, JSON.parse(stateStr))
  : defaultState

export const useUserStore = defineStore('user', {
  state: () => stateObj,
  actions: {
    setData(obj) {
      Object.keys(obj).forEach((key) => {
        this[key] = obj[key]
      })
      // 每次改动更新缓存
      localStorage.setItem('__user_store__', JSON.stringify(toRaw(this.$state)))
    },
  },
})
