import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default function ({ scrollbarRef, podLog, fetchData, appId }) {
  const router = useRouter()
  const tailLine = ref(10) // 初始行数
  const autoScroll = ref(false) // 自动滚动
  const lineFeed = ref(true) // 段落换行
  const fullScreen = ref(false) // 全屏

  // 置顶
  function scrollTop() {
    scrollbarRef.value && scrollbarRef.value.setScrollTop(0)
  }
  // 置底
  function scrollBottom() {
    scrollbarRef.value && scrollbarRef.value.setScrollTop(10000000)
  }
  // 清空控制台
  function clear() {
    podLog.value = []
  }
  // 重设初始行数
  function restart(v) {
    tailLine.value = v
    clear()
    fetchData()
  }
  // 段落换行
  function changeLineFeed(v) {
    lineFeed.value = v
  }
  // 全屏
  function changeFullScreen(v) {
    fullScreen.value = v
  }
  // 返回应用
  function back() {
    router.push({ name: 'appDetail', query: { appId } })
  }

  // toolbar触发器
  function triggerToolbar(type, state) {
    if (type === 'autoScroll') {
      autoScroll.value = state.autoScroll
    } else if (type === 'toTop') {
      scrollTop()
    } else if (type === 'toBottom') {
      scrollBottom()
    } else if (type === 'clear') {
      clear()
    } else if (type === 'fullScreen') {
      fullScreen()
    } else if (type === 'restart') {
      restart(state.tailLine)
    } else if (type === 'changeLineFeed') {
      changeLineFeed(state.lineFeed)
    } else if (type === 'changeFullScreen') {
      changeFullScreen(state.fullScreen)
    } else if (type === 'back') {
      back()
    }
  }

  return {
    autoScroll,
    tailLine,
    lineFeed,
    fullScreen,
    triggerToolbar,
    scrollBottom,
  }
}
