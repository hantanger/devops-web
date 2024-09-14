import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import routes from '@/router/routes'
import { useUserStore } from './../store/user'

export default function () {
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()

  // 收集menuIndex-routeName，用于点击菜单跳转
  const indexToRoute = {}
  // 当前菜单项
  const currentMenu = ref('')

  // 递归routes，收集menuIndex-routeName，用于点击菜单跳转
  ;(function traverseRoutes(arr) {
    arr.forEach((item) => {
      item?.meta?.menuIndex &&
        item?.meta?.isMenuPage &&
        (indexToRoute[item.meta.menuIndex] = item.name)
      item?.children?.length && traverseRoutes(item?.children)
    })
  })(routes)

  // 点击菜单，跳转到菜单下的主页
  function selectMenu(index) {
    if (indexToRoute[index]) {
      const query = {}
      if (['hjfzgl', 'fblb'].indexOf(index) >= 0) {
        query.createdBy = userStore.username
      }
      router.push({ name: indexToRoute[index], query })
    } else {
      console.error(`menuIndex不存在：${index}`)
    }
  }

  // 刷新页面高亮对应的menu
  watch(
    () => route.meta.menuIndex,
    (v) => {
      currentMenu.value = v
    },
    {
      immediate: true,
    }
  )

  return {
    currentMenu,
    selectMenu,
  }
}
