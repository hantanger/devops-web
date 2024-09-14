import EnvManage from '@/views/Web/EnvManage/index.vue'
import EnvDetail from '@/views/Web/EnvDetail/index.vue'

export default [
  {
    path: 'envManage',
    name: 'envManage',
    component: EnvManage,
    meta: { menuIndex: 'hjgl', isMenuPage: true, title: '环境管理' }, // 菜单下首页
  },
  {
    path: 'envDetail',
    name: 'envDetail',
    component: EnvDetail,
    meta: { menuIndex: 'hjgl', title: '环境详情' },
  },
]
