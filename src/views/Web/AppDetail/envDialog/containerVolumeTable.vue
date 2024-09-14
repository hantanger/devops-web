<template>
  <el-table border stripe :data="tableData">
    <el-table-column label="卷名称">
      <template #default="{ row }">
        <el-input v-model="row.name"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="读写权限" width="100px">
      <template #default="{ row }">
        <el-switch
          v-model="row.readOnly"
          inline-prompt
          active-text="只读"
          inactive-text="读写"
          style="--el-switch-on-color: #ff4949; --el-switch-off-color: #f17f42"
        />
      </template>
    </el-table-column>
    <el-table-column label="挂载路径">
      <template #default="{ row }">
        <el-input v-model="row.mountPath"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="子路径">
      <template #default="{ row }">
        <el-input v-model="row.subPath"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="60px">
      <template #default="{ $index }">
        <el-link :underline="false" type="danger" @click="clickDel($index)">
          删除
        </el-link>
      </template>
    </el-table-column>
  </el-table>
  <el-button class="mt-10" plain @click="clickAdd">+ 数据卷</el-button>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([])

// 删除
function clickDel(index) {
  tableData.value.splice(index, 1)
}

// 添加
function clickAdd() {
  tableData.value.push({
    name: '',
    readOnly: false,
    mountPath: '',
    subPath: '',
  })
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
