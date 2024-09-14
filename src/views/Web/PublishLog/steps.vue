<template>
  <el-steps
    :active="processIndex"
    :process-status="processStatus"
    finish-status="success"
  >
    <el-step
      v-for="(item, index) in statusList"
      :key="index"
      :title="item.label"
    >
      <!-- 调整处理中的节点的效果 -->
      <template
        v-if="processIndex === index && processStatus === 'process'"
        #icon
      >
        <el-icon class="is-loading color-primary u-process-icon">
          <Loading />
        </el-icon>
      </template>
      <template
        v-if="processIndex === index && processStatus === 'process'"
        #title
      >
        <span class="color-primary">{{ item.label }}</span>
      </template>
    </el-step>
  </el-steps>
</template>

<script setup>
defineProps({
  processIndex: Number,
  statusList: Array,
  processStatus: String,
})
</script>

<style scoped></style>
