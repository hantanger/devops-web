import AppManage from '@/views/Web/AppManage/index.vue'
import AppDetail from '@/views/Web/AppDetail/index.vue'
import PodLog from '@/views/Web/PodLog/index.vue'

export default [
  {
    path: 'appManage',
    name: 'appManage',
    component: AppManage,
    meta: { menuIndex: 'yygl', isMenuPage: true, title: '应用管理' }, // 应用下的主页面
  },
  {
    path: 'appDetail',
    name: 'appDetail',
    component: AppDetail,
    meta: { menuIndex: 'yygl', title: '应用详情' },
  },
  {
    path: 'podLog',
    name: 'podLog',
    component: PodLog,
    meta: { menuIndex: 'yygl', title: 'Pod日志' },
  },
]
