import { ref } from 'vue'
import { useWebSocket, useTitle } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import errorHtml from '@/utils/errorHtml'
import useToolbar from './useToolbar'

export default function ({ podName, branchId, appId, scrollbarRef }) {
  useTitle(`Pod ${podName}`)
  // 当前pod的日志
  const podLog = ref([])
  // 输入日志的内容
  const inputLog = ref('')

  const {
    autoScroll,
    tailLine,
    lineFeed,
    fullScreen,
    scrollBottom,
    triggerToolbar,
  } = useToolbar({
    scrollbarRef,
    podLog,
    fetchData,
    appId,
  })

  // websocket配置
  const { status, send } = useWebSocket(
    `ws://${import.meta.env.VITE_APP_HOST}/devopsapi/websocket`,
    {
      // heartbeat: {
      //   message: 'ping',
      //   interval: 60000,
      //   pongTimeout: 60000,
      // },
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          ElMessage.error('连接失败')
        },
      },
      onConnected() {
        fetchData()
      },
      onMessage(ws, e) {
        podLog.value.push(errorHtml(e.data))

        if (e.data && autoScroll.value) {
          // 有新内容时滚动到最底部
          setTimeout(() => scrollBottom())
        }
      },
    }
  )

  // let i = 0
  // setInterval(() => {
  //   podLog.value.push(`-------- ${i++}`)
  // }, 1000)

  // 查询数据
  function fetchData() {
    send(
      JSON.stringify({
        appDeployId: branchId,
        podName,
        tailLine: tailLine.value,
        type: 0,
      })
    )
  }

  // 输入日志
  function enterLog() {
    podLog.value.push(errorHtml(inputLog.value || ' '))
    inputLog.value = ''
    setTimeout(() => scrollBottom())
  }

  setTimeout(() => {
    send(
      JSON.stringify({
        appDeployId: branchId,
        podName,
        tailLine: tailLine.value,
        type: 0,
      })
    )
  }, 2000)

  return {
    status,
    podLog,
    inputLog,
    autoScroll,
    tailLine,
    lineFeed,
    fullScreen,
    enterLog,
    triggerToolbar,
  }
}
