import ejs from 'ejs'

export default function (options) {
  let envConfig
  return {
    name: 'vite-plugin-html-inject',
    configResolved(resolvedConfig) {
      envConfig = resolvedConfig.env
    },
    transformIndexHtml(html) {
      let opts = envConfig || {}
      if (options && typeof options === 'object') {
        opts = { ...envConfig, ...options }
      }
      return ejs.render(html, opts)
    },
  }
}
