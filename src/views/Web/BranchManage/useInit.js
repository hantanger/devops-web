import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ajaxStore from '@/ajaxStore'

export default function ({ formData, getTableList }) {
  const testaEnvId = ref('')
  const appListLoading = ref(false)
  const appList = ref([])

  // 因为弹窗只能批量创建testa的环境分支
  async function getTestaEnv() {
    const res = await ajaxStore.envManage.getEnvList({})
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      const testaEnvs = res.data.data.filter((item) => item.name === 'dev')
      if (testaEnvs[0]) {
        testaEnvId.value = testaEnvs[0].id
        formData.value.envId = testaEnvs[0].id
        getTableList()
      } else {
        ElMessage.error('无法确定特定的testa环境')
      }
    }
  }

  async function getAppList() {
    if (!testaEnvId.value) {
      appList.value = []
      return
    }

    appListLoading.value = true
    appList.value = []
    const res = await ajaxStore.branchManage.findAppByRoutingMark({
      envId: testaEnvId.value,
      routingMark: '',
    })
    appListLoading.value = false
    if (res?.data?.code === '0') {
      appList.value = (res?.data?.data ?? []).map((item) => {
        return {
          key: String(item.appId),
          label: `${item.appName}（${item.appType}）`,
        }
      })
    }
  }

  async function init() {
    await getTestaEnv()
    await getAppList()
  }

  init()

  return {
    testaEnvId,
    appList,
    appListLoading,
  }
}
