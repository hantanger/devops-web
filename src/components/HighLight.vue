<template>
  <div class="hight-light hljs" v-html="hljsStr"></div>
</template>

<script setup name="HighLight">
import { computed } from 'vue'
import hljs from 'highlight.js'
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  lang: {
    type: String,
    default: 'html',
  },
})

const hljsStr = computed(() => {
  return hljs.highlight(props.code, { language: props.lang }).value
})
</script>

<style lang="stylus" scoped>
.hight-light
  padding: 20px
  border: 1px solid #e4e7ed
  border-radius: 4px
  white-space: pre-wrap
  font-size: 14px
</style>
