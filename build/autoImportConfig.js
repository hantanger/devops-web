export default {
  // 转换目标
  include: [/\.[tj]sx?$/, /\.vue&/, /\.vue\?vue/],
  // 注册全局import
  imports: [
    "vue", // 已预设导出的API
    "vue-router", // 已预设导出的API
    {
      "/src/ajaxStore": [["default", "ajaxStore"]],
    },
  ],
  // 解决eslint报错
  // 启动时会生成.eslintrc-auto-import.json文件
  // 将其引入eslintrc.js即可
  eslintrc: {
    enabled: true, // 默认为false
    filepath: "./.eslintrc-auto-import.json", // 默认为'./.eslintrc-auto-import.json'
  },
};
