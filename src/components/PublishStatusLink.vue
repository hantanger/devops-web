<template>
  <span v-if="status === 0">
    <span>{{ publishDetailStatus[status] }}</span>
    <el-icon class="is-loading"><Loading /></el-icon>
  </span>
  <span v-else-if="status === -100">
    {{ publishDetailStatus[status] }}
  </span>
  <template v-else>
    <router-link
      class="flex items-center"
      v-if="publishId"
      :to="{
        name: 'publishLog',
        query: { publishId },
      }"
    >
      <span :class="classObj">
        {{ publishDetailStatus[status] }}
      </span>
      <el-icon><Link /></el-icon>
    </router-link>
    <span v-else :class="classObj">{{ publishDetailStatus[status] }}</span>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { publishDetailStatus } from '@/const/enum'

const props = defineProps({
  status: Number,
  publishId: Number, // 不传publishId则没有链接
})

const classObj = computed(() => {
  return {
    'color-danger': props.status < 0 && props.status > -100,
    'color-success': props.status > 0,
  }
})
</script>
