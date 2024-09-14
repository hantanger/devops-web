<template>
  <el-dialog
    title="批量创建环境分支"
    width="1000px"
    :model-value="visible"
    @close="$emit('close')"
  >
    <el-alert
      class="mb-20"
      type="warning"
      title="输入环境分支后会搜索出应用列表，已包含此环境分支的应用会被禁用。自动创建的git分支名为“feature/环境分支”。"
      :closable="false"
    ></el-alert>
    <el-input
      style="width: 250px"
      placeholder="请输入需要创建的环境分支名称"
      v-model="routingMark"
      @change="getAppList"
    ></el-input>
    <div>
      <el-transfer
        class="w-full mt-20 flex items-center p-transfer"
        filterable
        :titles="['应用列表', '确认应用']"
        :data="appList"
        v-loading="appListLoading"
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
import { watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import ajaxStore from '@/ajaxStore'

const props = defineProps({
  visible: Boolean,
  testaEnvId: [Number, String],
})

const emit = defineEmits(['success'])

const routingMark = ref('')
const appListLoading = ref(false)
const appList = ref([])
const selectedApp = ref([])
const submitLoading = ref(false)

async function getAppList() {
  if (!props.testaEnvId || !routingMark.value) {
    appList.value = []
    return
  }

  appListLoading.value = true
  appList.value = []
  selectedApp.value = []
  const res = await ajaxStore.branchManage.findAppByRoutingMark({
    envId: props.testaEnvId,
    routingMark: routingMark.value,
  })
  appListLoading.value = false
  if (res?.data?.code === '0') {
    appList.value = (res?.data?.data ?? []).map((item) => {
      return {
        key: item.appId,
        label: `${item.appName}（${item.appType}）`,
        disabled: item.existRoutingMark,
      }
    })
  }
}

async function clickSure() {
  submitLoading.value = true
  const res = await ajaxStore.branchManage.batchCreateBranch({
    appIds: selectedApp.value,
    routingMark: routingMark.value,
  })
  submitLoading.value = false
  if (res?.data?.code === '0') {
    ElMessage.success('批量创建环境分支成功')
    emit('success')
  }
}

// 重新打开弹框时重置数据
watch(
  () => props.visible,
  (v) => {
    if (v) {
      routingMark.value = ''
      appList.value = []
      selectedApp.value = []
    }
  }
)
</script>

<style lang="stylus" scoped>
.p-transfer
  :deep(.el-transfer-panel)
    flex 1
  :deep(.el-input)
    display flex
</style>
