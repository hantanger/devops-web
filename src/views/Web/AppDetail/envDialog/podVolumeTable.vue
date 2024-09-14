<template>
  <el-table border stripe :data="tableData">
    <el-table-column label="卷名称">
      <template #default="{ row }">
        <el-input v-model="row.name"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="140px">
      <template #default="{ row }">
        <el-select v-model="row.type">
          <el-option
            v-for="opt in typeOptions"
            :key="opt.label"
            :label="opt.label"
            :value="opt.value"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="值" width="180px">
      <template #default="{ row }">
        <el-input v-if="row.type !== 'emptyDir'" v-model="row.value"></el-input>
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
  <el-button class="mt-10" plain @click="clickAdd">+ 名值对</el-button>
</template>

<script setup>
import { ref } from 'vue'

const typeOptions = [
  { label: 'EmptyDir', value: 'emptyDir' },
  { label: 'HostPath', value: 'hostPath' },
  { label: 'ConfigMap', value: 'configMap' },
  { label: 'PVC', value: 'persistentVolumeClaim' },
  { label: 'Secret', value: 'secret' },
]

const tableData = ref([])

// 删除
function clickDel(index) {
  tableData.value.splice(index, 1)
}

// 添加
function clickAdd() {
  tableData.value.push({
    name: '',
    type: '',
    value: '',
  })
}

function getData() {
  const arr = []
  tableData.value.forEach(({ name, type, value }) => {
    const obj = { name }
    switch (type) {
      case 'emptyDir':
        obj.emptyDir = {}
        break
      case 'hostPath':
        obj.hostPath = { path: value, type: '' }
        break
      case 'configMap':
        obj.configMap = { name: value }
        break
      case 'persistentVolumeClaim':
        obj.persistentVolumeClaim = { claimName: value }
        break
      case 'secret':
        obj.secret = { secretName: value }
        break
    }
    arr.push(obj)
  })
  return arr?.length ? JSON.stringify(arr) : ''
}

function setData(str) {
  if (str) {
    try {
      const arr = JSON.parse(str)
      const resArr = []
      arr.forEach((item) => {
        if (item.emptyDir) {
          resArr.push({
            name: item.name,
            type: 'emptyDir',
            value: item.emptyDir,
          })
        } else if (item.hostPath) {
          resArr.push({
            name: item.name,
            type: 'hostPath',
            value: item.hostPath.path,
          })
        } else if (item.configMap) {
          resArr.push({
            name: item.name,
            type: 'configMap',
            value: item.configMap.name,
          })
        } else if (item.persistentVolumeClaim) {
          resArr.push({
            name: item.name,
            type: 'persistentVolumeClaim',
            value: item.persistentVolumeClaim.claimName,
          })
        } else if (item.secret) {
          resArr.push({
            name: item.name,
            type: 'secret',
            value: item.secret.secretName,
          })
        }
      })
      tableData.value = resArr
    } catch (error) {
      console.error(error)
    }
  }
}

function resetFields() {
  tableData.value = []
}

defineExpose({
  tableData,
  getData,
  setData,
  resetFields,
})
</script>

<style scoped></style>
