import { computed, ref } from 'vue'
import { promiseTimeout, useTitle } from '@vueuse/core'
import ajaxStore from '@/ajaxStore'
import errorHtml from '@/utils/errorHtml'
import useToolbar from './useToolbar'

export default function ({ publishId, scrollbarRef }) {
  const title = useTitle('发布详情')
  // 构建日志正文
  const logs = ref([])
  const more = ref(true)
  const fromJenkins = ref()
  const size = ref(0)

  // 状态
  const statusList = ref([])
  // 处理中的节点序号
  const processIndex = ref(0)
  // 处理中的节点的状态
  const processStatus = ref('process') //  process / error / success

  // 详情
  const detail = ref({})
  const detailLoading = ref(false)

  const appId = computed(() => detail.value?.appId ?? '')

  const publishLoading = computed(
    () => more.value && processStatus.value === 'process'
  )

  const { autoScroll, scrollBottom, triggerToolbar } = useToolbar({
    scrollbarRef,
    appId,
  })

  async function getLog() {
    while (processStatus.value === 'process' && more.value === true) {
      const res = await ajaxStore.publishManage.getLog({
        appPublishDetailId: publishId,
        fromJenkins: fromJenkins.value,
        size: size.value,
      })
      if (res?.data?.code === '0' && res?.data?.data) {
        const data = res.data.data

        data?.text && logs.value.push(errorHtml(data.text))
        fromJenkins.value = data?.fromJenkins
        size.value = data?.size

        if (data?.more !== true) {
          more.value = false
          break
        }
        if (processStatus.value === 'process' && autoScroll.value) {
          // 有新内容时滚动到最底部
          setTimeout(() => scrollBottom())
        }
      } else {
        break
      }
      // 延长调接口的间隔
      await promiseTimeout(1000)
    }
  }

  async function getStatus() {
    while (processStatus.value === 'process') {
      const res = await ajaxStore.publishManage.getStatus({
        data: publishId,
      })
      if (res?.data?.code === '0' && res?.data?.data) {
        const data = res.data.data.map(({ phaseDesc, phaseStatus }) => ({
          label: phaseDesc, // 阶段描述
          value: phaseStatus, // 阶段结果：0--未开始，正数--成功，负数--失败
        }))
        statusList.value = data

        // 处理中的节点的序号
        const doingIndex = data.findIndex((item) => item.value === 0)
        // 失败节点的序号
        const failIndex = data.findIndex((item) => item.value < 0)
        // 是否有节点失败
        const hasFail = failIndex >= 0
        if (hasFail) {
          // 有失败
          processStatus.value = 'error'
          processIndex.value = failIndex
          title.value = `发布失败 ${detail.value.appName}`
          break
        } else if (doingIndex < 0) {
          // 无处理中的节点，全部已完成
          processStatus.value = 'success'
          processIndex.value = data.length
          title.value = `发布完成 ${detail.value.appName}`
          break
        } else {
          // 找到第一个进行中的节点的序号
          processStatus.value = 'process'
          processIndex.value = doingIndex
          title.value = `发布中 ${detail.value.appName}`
        }
      } else {
        break
      }
      // 延长调接口的间隔
      await promiseTimeout(1000)
    }
  }

  async function getDetail() {
    detailLoading.value = true
    const res = await ajaxStore.publishManage.getDetail({
      data: publishId,
    })
    detailLoading.value = false
    if (res?.data?.code === '0' && res?.data?.data) {
      detail.value = res.data.data
    }
  }

  async function init() {
    await getDetail()
    getLog()
    getStatus()
  }

  init()

  return {
    detailLoading,
    publishLoading,
    detail,
    statusList,
    processIndex,
    processStatus,
    logs,
    autoScroll,
    triggerToolbar,
  }
}
