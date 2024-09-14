import { onMounted, ref } from 'vue'
import { useDateFormat, useTitle } from '@vueuse/core'
import ajaxStore from '@/ajaxStore'

export default function ({ appId }) {
  const activeTab = ref()
  const appDetail = ref({})
  const envList = ref([])
  const detailLoading = ref(false)
  const envLoading = ref(false)

  // 查询应用详情
  async function getAppDetail() {
    detailLoading.value = true
    const res = await ajaxStore.appManage.getAppDetail({ id: appId })
    detailLoading.value = false
    if (res?.data?.code === '0' && res?.data?.data) {
      const data = res.data.data
      data?.updatedTime &&
        (data.updatedTime = useDateFormat(data.updatedTime, 'YYYY-MM-DD HH:mm'))
      data?.createdTime &&
        (data.createdTime = useDateFormat(data.createdTime, 'YYYY-MM-DD HH:mm'))
      appDetail.value = data

      useTitle(`应用详情 ${data.name}`)
    }
  }

  // 查询环境列表
  async function getEnvBranch() {
    envLoading.value = true
    const res = await ajaxStore.appManage.getEnvBranch({ data: appId })
    envLoading.value = false
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      const arr = res.data.data
      // 处理env的排序
      envList.value = arr.sort((a, b) => a.orderBy - b.orderBy)

      // 初始化默认tab，有初始tab并新增tab时，或无初始tab时
      if (
        (activeTab.value &&
          envList.value.findIndex((item) => item.envId === activeTab.value) <
            0) ||
        !activeTab.value
      )
        initActiveTab()
    } else {
      envList.value = []
    }
  }

  function initActiveTab() {
    activeTab.value = envList.value?.[0]?.envId
  }

  async function refreshEnvBranch() {
    await getEnvBranch()
  }

  onMounted(async () => {
    await getAppDetail()
    await getEnvBranch()
    initActiveTab()
  })

  return {
    appDetail,
    activeTab,
    envList,
    detailLoading,
    envLoading,
    refreshEnvBranch,
  }
}
