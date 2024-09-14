import Login from '@/views/Login/index.vue'
import NotFound from '@/views/NotFound/index.vue'
import Web from '@/views/Web/Index/index.vue'
import AppManageRoutes from './appManage'
import EnvManageRoutes from './envManage'
import TplManageRoutes from './tplManage'
import PublishManageRoutes from './publishManage'
import CollectManageRoutes from './collectManage'
import BranchManageRoutes from './branchManage'

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    name: 'devops',
    redirect: { name: 'login' },
    component: Web,
    children: [
      ...AppManageRoutes,
      ...EnvManageRoutes,
      ...TplManageRoutes,
      ...PublishManageRoutes,
      ...CollectManageRoutes,
      ...BranchManageRoutes,
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

export default routes
