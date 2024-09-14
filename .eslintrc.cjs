module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-essential', 'standard', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'vue/multi-word-component-names': 'off', // 组件名字需由多个单词组成
    'vue/require-v-for-key': 'off', // html原生元素上的v-for必须要有key
    'vue/valid-v-for': 'off', // 组件元素上的v-for必须要有key
  },
}
