import { ref, watch } from 'vue'
import ajaxStore from '@/ajaxStore'

export default function ({ formData, optionsLoaded }) {
  const initLoading = ref(true)
  const appOptions = ref([])
  const envOptions = ref([])
  const branchOptions = ref([])
  const publishOrderOptions = ref([])
  const statusOptions = [
    { label: '发布中', value: '0' },
    { label: '发布成功', value: '1' },
    { label: '发布失败', value: '-1' },
    { label: '构建中', value: '2' },
    { label: '构建失败', value: '-2' },
    { label: '部署中', value: '3' },
    { label: '部署失败', value: '-3' },
  ]

  async function getAppOptions() {
    const res = await ajaxStore.appManage.getAppList({})
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      appOptions.value = res.data.data.map((item) => ({
        label: item.name,
        value: String(item.id),
        appType: item.appType,
      }))
    }
  }
  async function getEnvOptions() {
    const res = await ajaxStore.envManage.getEnvList({})
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      envOptions.value = res.data.data.map((item) => ({
        label: item.name,
        value: String(item.id),
      }))
    }
  }

  async function getBranchOptions() {
    const { appId, envId } = formData.value
    if (appId && envId) {
      const params = {}
      params.appId = Number(appId)
      params.envId = Number(envId)
      const res = await ajaxStore.appManage.getBranchList(params)
      if (res?.data?.code === '0' && res?.data?.data) {
        branchOptions.value = res.data.data.map((item) => ({
          label: item.routingMark,
          value: String(item.id),
        }))
      }
    }
  }

  async function getPublishOrderOptions() {
    const res = await ajaxStore.publishManage.getPagedPublishOrder({})
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      publishOrderOptions.value = res.data.data.map((item) => ({
        label: item.name,
        value: String(item.id),
      }))
    }
  }

  // 应用名称、环境名称有一个为空，则环境分支为空
  watch(
    [() => formData.value.appId, () => formData.value.envId],
    ([appId, envId]) => {
      if (!appId || !envId) {
        formData.value.appDeployId = ''
      } else {
        getBranchOptions()
      }
    }
  )

  async function init() {
    initLoading.value = true
    getPublishOrderOptions()
    await getAppOptions()
    await getEnvOptions()
    const { appId, envId } = formData.value
    if (appId && envId) {
      await getBranchOptions()
    }
    initLoading.value = false
    optionsLoaded()
  }

  init()

  return {
    initLoading,
    appOptions,
    envOptions,
    branchOptions,
    statusOptions,
    publishOrderOptions,
    getBranchOptions,
  }
}
