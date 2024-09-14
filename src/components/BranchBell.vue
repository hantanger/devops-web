<template>
  <div>
    <div>{{ name }}</div>
    <div v-if="change">
      <el-tag effect="plain" type="success">
        <el-icon>
          <Opportunity />
        </el-icon>
        代码有变更
      </el-tag>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  change: Boolean,
})
</script>
