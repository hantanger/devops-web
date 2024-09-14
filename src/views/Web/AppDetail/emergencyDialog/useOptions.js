import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'

export default function ({ branchId }) {
  const typeOptions = [
    { label: '重新发布master分支', value: 'self' },
    { label: '合并Testa分支发布', value: 'branch' },
  ]

  const branchOptions = ref([])

  // 查询环境
  async function getBranchList() {
    const res = await ajaxStore.appManage.getBinding({ data: branchId.value })
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      branchOptions.value = res.data.data
    }
  }

  function initOptions() {
    getBranchList()
  }

  return {
    typeOptions,
    branchOptions,
    initOptions,
  }
}
