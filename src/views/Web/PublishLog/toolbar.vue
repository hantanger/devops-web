<template>
  <div class="p-toolbar">
    <el-space :size="20" spacer="|">
      <!-- 自动滚动 -->
      <span class="flex items-center">
        <span class="u-label">日志自动滚动：</span>
        <el-switch
          v-model="formData.autoScroll"
          inline-prompt
          active-text="开"
          inactive-text="关"
          @change="trigger('autoScroll')"
        />
      </span>
      <el-link
        class="font-12"
        type="primary"
        icon="Top"
        :underline="false"
        @click="trigger('toTop')"
      >
        置顶
      </el-link>
      <el-link
        class="font-12"
        type="primary"
        icon="Bottom"
        :underline="false"
        @click="trigger('toBottom')"
      >
        置底
      </el-link>
      <!-- 返回应用 -->
      <el-link
        class="font-12"
        type="primary"
        icon="Back"
        :underline="false"
        @click="trigger('back')"
      >
        返回应用
      </el-link>
    </el-space>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { deepCopy } from '@/utils/util'

const props = defineProps({
  defaultAutoScroll: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['trigger'])

const formData = ref({
  autoScroll: props.defaultAutoScroll,
})

function trigger(type) {
  emit('trigger', type, deepCopy(formData.value))
}
</script>

<style lang="stylus" scoped>
.p-toolbar
  padding 0 20px
  border-bottom 1px solid var(--el-border-color)
  font-size 12px
  color var(--el-text-color-primary)
</style>
