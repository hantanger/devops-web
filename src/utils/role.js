import { useUserStore } from './../store/user'

/**
 * 通过用户role判断是否有权限
 * @param {string | string[]} v 必要的role
 * 现有role：
 *     ADMIN("0", "系统管理员"),
 *     APP_ADMIN("1", "应用管理员"),
 *     NORMAL("2", "普通用户");
 */
export function hasRole(v) {
  const userStore = useUserStore()
  if (typeof v === 'string') {
    // v-role="0"
    if (v === userStore.role) {
      return true
    }
  } else if (v instanceof Array) {
    // v-role="[0,1]"
    if (v.findIndex((item) => v === userStore.role) >= 0) {
      return true
    }
  }
}
