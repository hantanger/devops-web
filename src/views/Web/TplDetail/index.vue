<template>
  <div class="p-20 bg-white br-6">
    <el-descriptions :title="detail.name || '- -'" size="large">
      <el-descriptions-item label="模板类型">
        <el-tag size="small">
          {{ templateType[detail.templateType] || '- -' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建人">
        <PersonNames :names="detail.createdBy"></PersonNames>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ detail.createdTime || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">
        {{ detail.remark || '- -' }}
      </el-descriptions-item>
      <el-descriptions-item label="更新人">
        <PersonNames :names="detail.updatedBy"></PersonNames>
      </el-descriptions-item>
      <el-descriptions-item label="更新时间">
        {{ detail.updatedTime || '- -' }}
      </el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">模板内容</el-divider>
    <HighLight
      :code="detail.content || '- -'"
      :lang="templateType[detail.templateType]"
    ></HighLight>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTitle, useDateFormat } from '@vueuse/core'
import { useRoute } from 'vue-router'
import ajaxStore from '@/ajaxStore'
import { templateType } from '@/const/enum'
import PersonNames from '@/components/PersonNames.vue'
import HighLight from '@/components/HighLight.vue'

const {
  query: { tplId },
} = useRoute()
const detail = ref({})

async function getDetail() {
  const res = await ajaxStore.tplManage.getPagedTpl({ id: tplId })
  if (res?.data?.code === '0' && res?.data?.data?.pagedRecords?.length) {
    const data = res.data.data.pagedRecords[0]
    data.createdTime = useDateFormat(data.createdTime, 'YYYY-MM-DD HH:mm')
    data.updatedTime = useDateFormat(data.updatedTime, 'YYYY-MM-DD HH:mm')
    detail.value = data
    useTitle(`模板详情 ${data.name}`)
  }
}

getDetail()
</script>
