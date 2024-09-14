import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default function ({ scrollbarRef, appId }) {
  const router = useRouter()

  const autoScroll = ref(false) // 自动滚动

  function scrollTop() {
    scrollbarRef.value && scrollbarRef.value.setScrollTop(0)
  }
  function scrollBottom() {
    scrollbarRef.value && scrollbarRef.value.setScrollTop(1000000)
  }

  function back() {
    router.push({ name: 'appDetail', query: { appId: appId.value } })
  }

  function triggerToolbar(type, state) {
    if (type === 'autoScroll') {
      autoScroll.value = state.autoScroll
    } else if (type === 'toTop') {
      scrollTop()
    } else if (type === 'toBottom') {
      scrollBottom()
    } else if (type === 'back') {
      back()
    }
  }

  return {
    autoScroll,
    triggerToolbar,
    scrollBottom,
  }
}
