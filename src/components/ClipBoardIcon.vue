<template>
  <el-tooltip placement="top" content="点击复制">
    <el-link type="primary" :underline="false" @click="clickCopy">
      <el-icon>
        <DocumentCopy />
      </el-icon>
    </el-link>
  </el-tooltip>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const props = defineProps({
  content: String,
})

const { copy } = useClipboard({ source: props.content })

function clickCopy() {
  copy()
  ElMessage.success('复制成功')
}
</script>
