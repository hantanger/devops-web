<template>
  <el-table border stripe :data="tableData">
    <el-table-column label="类型" prop="type" width="100px"></el-table-column>
    <el-table-column label="CPU" prop="cpu">
      <template #default="{ row }">
        <el-input placeholder="1000m 或者 1" v-model="row.cpu"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="内存" prop="memory">
      <template #default="{ row }">
        <el-input placeholder="单位 Mi 或 Gi" v-model="row.memory"></el-input>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { deepCopy } from '@/utils/util'

const defaultData = [
  { type: 'limits', cpu: '', memory: '' },
  { type: 'requests', cpu: '', memory: '' },
]

// 资源参数的数据
const tableData = ref(deepCopy(defaultData))

function getData() {
  const arr = tableData.value
  return JSON.stringify({
    limits: {
      cpu: arr[0].cpu,
      memory: arr[0].memory,
    },
    requests: {
      cpu: arr[1].cpu,
      memory: arr[1].memory,
    },
  })
}

function setData(str) {
  if (str) {
    try {
      const obj = JSON.parse(str)
      tableData.value = [
        {
          type: 'limits',
          cpu: obj?.limits?.cpu ?? '',
          memory: obj?.limits?.memory ?? '',
        },
        {
          type: 'requests',
          cpu: obj?.requests?.cpu ?? '',
          memory: obj?.requests?.memory ?? '',
        },
      ]
    } catch (error) {
      console.error(error)
    }
  }
}

function resetFields() {
  tableData.value = deepCopy(defaultData)
}

defineExpose({
  getData,
  setData,
  resetFields,
})
</script>

<style scoped></style>
