<template>
  <el-tooltip
    placement="top"
    :content="formatTime(time, 'yyyy-MM-dd hh:mm:ss')"
  >
    <span class="cursor-pointer" v-show="time">{{ friendlyTime(time) }}</span>
  </el-tooltip>
</template>

<script setup>
import { friendlyTime, formatTime } from '@/utils/timeFormatter'

defineProps({
  time: [String, Number],
})
</script>

<style scoped></style>
