<template>
  <el-form
    ref="formRef"
    label-width="100px"
    label-position="left"
    :model="formData"
  >
    <el-row :gutter="40">
      <el-col :span="12">
        <el-form-item label="TCP端口" prop="tcpSocket.port">
          <el-input v-model.number="formData.tcpSocket.port"></el-input>
        </el-form-item>
        <el-form-item label="初始延迟" prop="initialDelaySeconds">
          <el-input v-model.number="formData.initialDelaySeconds">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="执行探测频率" prop="periodSeconds">
          <el-input v-model.number="formData.periodSeconds">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="超时时间" prop="timeoutSeconds">
          <el-input v-model.number="formData.timeoutSeconds">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="健康阈值" prop="successThreshold">
          <el-input v-model.number="formData.successThreshold">
            <template #append>次</template>
          </el-input>
        </el-form-item>
        <el-form-item label="不健康阈值" prop="failureThreshold">
          <el-input v-model.number="formData.failureThreshold">
            <template #append>次</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import { deepCopy } from '@/utils/util'

const formRef = ref()

const defaultData = {
  failureThreshold: 50, // 不健康阈值
  initialDelaySeconds: 30, // 初始延迟（秒）
  periodSeconds: 5, // 执行探测频率（秒）
  successThreshold: 1, // 健康阈值
  tcpSocket: { port: 8080 }, // TCP 端口
  timeoutSeconds: 1, // 超时时间（秒）
}
// 存活探针的数据
const formData = ref(deepCopy(defaultData))

function getData() {
  return JSON.stringify(formData.value)
}

function setData(str) {
  if (str) {
    try {
      formData.value = JSON.parse(str)
    } catch (error) {
      console.error(error)
    }
  }
}

function resetFields() {
  formRef.value.resetFields()
}

defineExpose({
  getData,
  setData,
  resetFields,
})
</script>
