<template>
  <el-dialog
    title="创建发布单"
    width="1000px"
    :model-value="visible"
    @close="$emit('close')"
  >
    <el-select
      placeholder="选择环境"
      clearable
      filterable
      v-model="envId"
      @change="changeEnv"
    >
      <el-option
        v-for="item in envOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div>
      <el-transfer
        class="w-full mt-20 flex items-center p-transfer"
        filterable
        :titles="['Source', 'Target']"
        :data="appList"
        v-loading="deployLoading"
        v-model="selectedApp"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button plain :loading="submitLoading" @click="$emit('close')">
        取消
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="clickSure">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ajaxStore from '@/ajaxStore'

defineProps({
  visible: Boolean,
  envOptions: Array,
})

const emit = defineEmits(['success'])

const envId = ref()
const appList = ref([])
const selectedApp = ref([])
const deployLoading = ref(false)
const submitLoading = ref(false)

async function changeEnv() {
  deployLoading.value = true
  appList.value = []
  selectedApp.value = []
  const res = await ajaxStore.appManage.getDeployListByEnv({
    data: envId.value,
  })
  deployLoading.value = false
  if (res?.data?.code === '0') {
    appList.value = (res?.data?.data ?? []).map((item) => {
      return {
        key: item.appId,
        label: `${item.appName}（${item.appType}）`,
      }
    })
  }
}
async function clickSure() {
  submitLoading.value = true
  const res = await ajaxStore.publishManage.batchPublish({
    envId: envId.value,
    appIds: selectedApp.value,
  })
  submitLoading.value = false
  if (res?.data?.code === '0') {
    ElMessage.success('创建发布单成功')
    emit('success')
  }
}
</script>

<style lang="stylus" scoped>
.p-transfer
  :deep(.el-transfer-panel)
    flex 1
  :deep(.el-input)
    display flex
</style>
