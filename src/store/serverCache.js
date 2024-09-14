// 调用后端接口进行缓存
import { defineStore } from 'pinia'
import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'

export const useServerCacheStore = defineStore('serverCache', function () {
  // 应用负责人
  const appOwnerList = ref([])
  const appOwnerMap = ref({}) // 以uid为key的map
  const appOwnerLoading = ref(false) // 初始状态就为true
  const appOwnerFetched = ref(false) // 是否已发起过查询
  /**
   *
   * @param {*} force 是否强制刷新
   * @returns
   */
  async function getAppOwnerList(force) {
    appOwnerFetched.value = true
    // 如果数据已存在，则直接返回
    if (!force && appOwnerList.value.length > 0) {
      return appOwnerList
    }
    appOwnerLoading.value = true
    const res = await ajaxStore.common.getAppOwners({ username: '' })
    appOwnerLoading.value = false
    if (res?.data?.code === '0' && res?.data?.data) {
      const data = res.data.data
      const dataMap = {}
      // 生成 list
      appOwnerList.value = data
      // 生成 map
      data.forEach((item) => {
        dataMap[item.uid] = item
      })
      appOwnerMap.value = dataMap
    }
    return appOwnerList
  }

  return {
    appOwnerLoading,
    appOwnerFetched,
    appOwnerList,
    appOwnerMap,
    getAppOwnerList,
  }
})
