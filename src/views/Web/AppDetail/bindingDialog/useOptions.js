import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'

export default function ({ branchId }) {
  const envOptions = ref([])

  // 查询环境
  async function getEnvList() {
    const res = await ajaxStore.appManage.getBinding({ data: branchId.value })
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      envOptions.value = res.data.data
    }
  }

  function initOptions() {
    getEnvList()
  }

  return {
    envOptions,
    initOptions,
  }
}
