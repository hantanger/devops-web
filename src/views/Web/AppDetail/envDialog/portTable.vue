<template>
  <el-table border stripe :data="tableData">
    <el-table-column label="端口名称">
      <template #default="{ row }">
        <el-input v-model="row.name"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="容器端口">
      <template #default="{ row }">
        <el-input type="number" v-model="row.containerPort"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ $index }">
        <el-link :underline="false" type="danger" @click="clickDel($index)">
          删除
        </el-link>
      </template>
    </el-table-column>
  </el-table>
  <el-button class="mt-10" plain @click="clickAdd">+ 添加端口</el-button>
</template>

<script setup>
import { ref } from 'vue'
import { deepCopy } from '@/utils/util'

const emit = defineEmits(['clickDel', 'clickAdd'])

const rowData = { containerPort: null, name: '', protocol: 'TCP' }

const tableData = ref([])

// 删除
function clickDel(index) {
  tableData.value.splice(index, 1)
  emit('clickDel')
}

// 添加
function clickAdd() {
  tableData.value.push(deepCopy(rowData))
  emit('clickAdd')
}

function getData() {
  return JSON.stringify(tableData.value)
}

function setData(str) {
  if (str) {
    try {
      tableData.value = JSON.parse(str)
    } catch (error) {
      console.error(error)
    }
  }
}

function resetFields() {
  tableData.value = []
}

defineExpose({
  getData,
  setData,
  resetFields,
})
</script>

<style scoped></style>
