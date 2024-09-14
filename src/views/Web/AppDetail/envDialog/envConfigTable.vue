<template>
  <el-table border stripe :data="tableData">
    <el-table-column label="环境变量名">
      <template #default="{ row }">
        <el-input v-model="row.name"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="150px">
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
    <el-table-column label="值">
      <template #default="{ row }">
        <div v-show="row.type === 'singleValue'">
          <el-input v-model="row.singleValue"></el-input>
        </div>
        <div class="flex items-center" v-show="row.type !== 'singleValue'">
          <el-input v-model="row.groupKey"></el-input>
          <el-input class="ml-5" v-model="row.groupValue"></el-input>
        </div>
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
  { label: '值', value: 'singleValue' },
  { label: 'ConfigMap', value: 'configMap' },
  { label: 'SecretKey', value: 'secretKey' },
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
    type: 'singleValue',
    singleValue: '',
    groupKey: '',
    groupValue: '',
  })
}

function getData() {
  const arr = []
  tableData.value.forEach((row) => {
    let obj = {}
    if (row.type === 'singleValue') {
      obj = {
        name: row.name,
        value: row.singleValue,
      }
    } else if (row.type === 'configMap') {
      obj = {
        name: row.name,
        valueFrom: {
          configMapKeyRef: {
            name: row.groupKey,
            key: row.groupValue,
          },
        },
      }
    } else if (row.type === 'secretKey') {
      obj = {
        name: row.name,
        valueFrom: {
          secretKeyRef: {
            name: row.groupKey,
            key: row.groupValue,
          },
        },
      }
    }
    arr.push(obj)
  })
  return arr?.length ? JSON.stringify(arr) : '[]'
}

function setData(str) {
  if (str) {
    try {
      const arr = JSON.parse(str)
      const resArr = []
      arr.forEach((item) => {
        if (item.value) {
          resArr.push({
            name: item.name,
            type: 'singleValue',
            singleValue: item.value,
            groupKey: '',
            groupValue: '',
          })
        } else if (item?.valueFrom?.configMapKeyRef?.name) {
          resArr.push({
            name: item.name,
            type: 'configMap',
            singleValue: '',
            groupKey: item?.valueFrom?.configMapKeyRef?.name ?? '',
            groupValue: item?.valueFrom?.configMapKeyRef?.key ?? '',
          })
        } else if (item?.valueFrom?.secretKeyRef?.name) {
          resArr.push({
            name: item.name,
            type: 'secretKey',
            singleValue: '',
            groupKey: item?.valueFrom?.secretKeyRef?.name ?? '',
            groupValue: item?.valueFrom?.secretKeyRef?.key ?? '',
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
  getData,
  setData,
  resetFields,
})
</script>

<style scoped></style>
