import { hasRole } from '../utils/role'

export default {
  install(app) {
    app.config.globalProperties.hasRole = hasRole
  },
}
