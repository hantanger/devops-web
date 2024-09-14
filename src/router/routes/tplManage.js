import TplManage from '@/views/Web/TplManage/index.vue'
import TplDetail from '@/views/Web/TplDetail/index.vue'

export default [
  {
    path: 'tplManage',
    name: 'tplManage',
    component: TplManage,
    meta: { menuIndex: 'mbgl', isMenuPage: true, title: '模板管理' }, // 菜单下主页
  },
  {
    path: 'tplDetail',
    name: 'tplDetail',
    component: TplDetail,
    meta: { menuIndex: 'mbgl', title: '模板详情' },
  },
]
