import PublishManage from '@/views/Web/PublishManage/index.vue'
import PublishLog from '@/views/Web/PublishLog/index.vue'

export default [
  {
    path: 'publishManage',
    name: 'publishManage',
    component: PublishManage,
    meta: { menuIndex: 'fblb', isMenuPage: true, title: '发布列表' }, // 发布列表下的主页面
  },
  {
    path: 'publishLog',
    name: 'publishLog',
    component: PublishLog,
    meta: { menuIndex: 'fblb', title: '发布详情' },
  },
]
