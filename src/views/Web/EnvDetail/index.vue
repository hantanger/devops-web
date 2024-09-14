<template>
  <div class="p-20 bg-white br-6">
    <el-descriptions :title="detail.name || '- -'" size="large">
      <el-descriptions-item label="通用配置" :span="3">
        <span class="break-all">
          {{ detail.commonData || '- -' }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="Jenkins Url">
        {{ detail.jenkinsUrl || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="Jenkins Token" :span="2">
        {{ detail.jenkinsToken || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="K8s Apiserver">
        {{ detail.k8sApiserver || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="K8s Namespace" :span="2">
        {{ detail.k8sNamespace || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="K8s Token" :span="3">
        <span class="break-all">
          {{ detail.k8sToken || '- -' }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="创建人">
        {{ detail.createdBy || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ detail.createdTime || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="是否支持特性环境">
        {{ supportSubEnv[detail.isSupportFeatureEnv] || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="更新人">
        {{ detail.updatedBy || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="更新时间">
        {{ detail.updatedTime || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="后缀">
        {{ detail.suffix || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="排序">
        {{ detail.orderBy || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">
        {{ detail.remark || '- -' }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTitle, useDateFormat } from '@vueuse/core'
import { useRoute } from 'vue-router'
import ajaxStore from '@/ajaxStore'
import { supportSubEnv } from '@/const/enum'

const {
  query: { envId },
} = useRoute()
const detail = ref({})

async function getDetail() {
  const res = await ajaxStore.envManage.getPagedEnv({ id: envId })
  if (res?.data?.code === '0' && res?.data?.data?.pagedRecords?.length) {
    const data = res.data.data.pagedRecords[0]
    data.createdTime = useDateFormat(data.createdTime, 'YYYY-MM-DD HH:mm')
    data.updatedTime = useDateFormat(data.updatedTime, 'YYYY-MM-DD HH:mm')
    detail.value = data

    useTitle(`环境详情 ${data.name}`)
  }
}

getDetail()
</script>

<style lang="stylus" scoped></style>
