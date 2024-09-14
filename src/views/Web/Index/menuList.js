import { hasRole } from '../../../utils/role'

export function getLeftMenuList() {
  return [
    {
      index: 'yygl',
      title: '应用管理',
      icon: 'Position',
    },
    {
      index: 'fblb',
      title: '发布列表',
      icon: 'MessageBox',
    },
    {
      index: 'hjgl',
      title: '环境管理',
      icon: 'PartlyCloudy',
      hide: !hasRole('0'),
    },
    {
      index: 'mbgl',
      title: '模板管理',
      icon: 'Files',
    },
  ]
}
