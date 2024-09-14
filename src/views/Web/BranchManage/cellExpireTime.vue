<template>
  <div>
    <FriendlyTime :time="expireTime"></FriendlyTime>
    <el-icon v-if="level >= 0" :class="`p-color-${level}`">
      <WarnTriangleFilled />
    </el-icon>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FriendlyTime from '@/components/FriendlyTime.vue'

const props = defineProps({
  expireTime: [Number, String],
})

// const oneDay = 86400000
const threeDay = 259200000
const sevenDay = 604800000
const level = computed(() => {
  const dis = new Date(props.expireTime) - new Date()
  if (dis <= threeDay) {
    return 0
  } else if (dis <= sevenDay) {
    return 1
  } else {
    return -1
  }
})
</script>

<style lang="stylus" scoped>
.p-color-0
  color var(--el-color-danger)
.p-color-1
  color var(--el-color-warning)
</style>
