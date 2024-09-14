import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import proxyTable from './build/proxyTable'
import autoImportConfig from './build/autoImportConfig'
import vitePluginHtmlInject from './build/vite-plugin-html-inject'

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport(autoImportConfig),
    vitePluginHtmlInject(),
  ],
  server: {
    proxy: proxyTable,
    hmr: true,
  },
})
