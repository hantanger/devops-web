import { defineStore } from 'pinia'
import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'

export const useCollectStore = defineStore('collect', function () {
  const list = ref([])

  async function getList() {
    const res = await ajaxStore.collectManage.getPagedCollect({
      pageSize: 100,
    })
    if (res?.data?.code === '0') {
      list.value = res?.data?.data?.pagedRecords ?? []
    }
  }

  return {
    list,
    getList,
  }
})
