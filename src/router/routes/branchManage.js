import { useUserStore } from '@/store/user'
import BranchManage from '@/views/Web/BranchManage/index.vue'

export default [
  {
    path: 'branchManage',
    name: 'branchManage',
    component: BranchManage,
    meta: { menuIndex: 'hjfzgl', isMenuPage: true, title: '环境分支管理' }, // 菜单下首页
    beforeEnter(to) {
      const userStore = useUserStore()
      // mode为self表示默认的createdBy为当前登录用户
      if (to?.query?.mode === 'self' && userStore.username) {
        const newQuery = { ...to.query }
        delete newQuery.mode
        newQuery.createdBy = userStore.username
        return { name: to.name, query: newQuery }
      }
    },
  },
]
