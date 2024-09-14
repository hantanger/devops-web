import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'

export default function ({ appId, appType, bindedEnvList }) {
  const envOptions = ref([])
  const templateAppOptions = ref([])

  // 查询环境
  async function getEnvList() {
    const res = await ajaxStore.envManage.getEnvList({})
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      const data = res.data.data
      if (bindedEnvList?.value?.length) {
        envOptions.value = data.map(({ id, name }) => ({
          id,
          name,
          disabled: bindedEnvList.value.indexOf(id) >= 0,
        }))
      } else {
        envOptions.value = data.map(({ id, name }) => ({
          id,
          name,
          disabled: false,
        }))
      }
    }
  }

  // 查询模板应用
  async function getTemplateAppList(envId) {
    const res = await ajaxStore.appManage.getAppList({
      appType: appType.value,
      envId,
    })
    if (res?.data?.code === '0') {
      if (res?.data?.data?.length) {
        const data = res.data.data
        templateAppOptions.value = data.filter(
          (item) => item.id !== Number(appId.value)
        )
      } else {
        templateAppOptions.value = []
      }
    }
  }

  function initOptions() {
    getEnvList()
  }
  return {
    envOptions,
    templateAppOptions,
    getTemplateAppList,
    initOptions,
  }
}
