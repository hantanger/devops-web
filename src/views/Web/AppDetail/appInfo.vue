<template>
  <el-descriptions size="large">
    <template #title>
      <span>应用名称：</span>
      <AppSelect
        ref="appSelectRef"
        class="mr-5"
        :defaultAppId="appId"
      ></AppSelect>
      <CollectBtn
        :appId="appId"
        :checked="appDetail.userAppFavorite"
        @success="appDetail.userAppFavorite = !appDetail.userAppFavorite"
      ></CollectBtn>
    </template>
    <el-descriptions-item label="Git地址">
      {{ appDetail.gitProjectUrl || '- -' }}
    </el-descriptions-item>
    <el-descriptions-item label="创建人">
      <PersonNames :names="appDetail.createdBy"></PersonNames>
    </el-descriptions-item>
    <el-descriptions-item label="创建时间">
      {{ appDetail.createdTime || '- -' }}
    </el-descriptions-item>
    <el-descriptions-item label="应用负责人">
      <PersonNames :names="appDetail.appOwner"></PersonNames>
    </el-descriptions-item>
    <el-descriptions-item label="更新人">
      <PersonNames :names="appDetail.updatedBy"></PersonNames>
    </el-descriptions-item>
    <el-descriptions-item label="更新时间">
      {{ appDetail.updatedTime || '- -' }}
    </el-descriptions-item>
    <el-descriptions-item label="类型">
      <el-tag size="small">{{ appType[appDetail.appType] || '- -' }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="备注">
      {{ appDetail.remark || '- -' }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { appType } from '@/const/enum'
import CollectBtn from '@/components/CollectBtn.vue'
import AppSelect from '@/components/AppSelect.vue'
import PersonNames from '@/components/PersonNames.vue'

const {
  query: { appId },
} = useRoute()

const props = defineProps({
  appDetail: Object,
})

const { appDetail } = toRefs(props)

const appSelectRef = ref()
</script>
