<template>
  <el-dialog
    title="创建部署环境"
    width="1000px"
    :model-value="visible"
    @close="$emit('close')"
  >
    <el-table border stripe :data="podList" v-loading="loading">
      <el-table-column prop="podName" label="Pod Name">
        <template #default="{ row }">
          <router-link
            target="_blank"
            :to="{
              name: 'podLog',
              query: { podName: row.podName, branchId, appId },
            }"
          >
            {{ row.podName }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'running' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ready" label="Ready" width="100">
        <template #default="{ row }">
          <el-tag :type="row.ready ? 'success' : 'danger'">
            {{ row.ready }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="podIP" label="Pod IP" width="100" />
      <el-table-column prop="restartCount" label="重启次数" width="100" />
      <el-table-column prop="startTime" label="Start Time" />
      <el-table-column prop="namespace" label="Namespace" />
    </el-table>
  </el-dialog>
</template>

<script setup name="PodDialog">
import { ref, watch } from 'vue'
import { useDateFormat } from '@vueuse/core'
import ajaxStore from '@/ajaxStore'

const props = defineProps({
  visible: Boolean,
  branchId: Number,
  appId: String,
})
// pod列表
const podList = ref([])
const loading = ref(false)

// 查询pod列表
async function getPodList() {
  podList.value = []
  loading.value = true
  const res = await ajaxStore.k8s.getPodList({ data: props.branchId })
  loading.value = false
  if (res?.data?.code === '0') {
    const data = res?.data?.data ?? []
    data.forEach((item) => {
      item.startTime = useDateFormat(item.startTime, 'YYYY-MM-DD HH:mm:ss')
    })
    podList.value = data
  }
}

watch(
  () => props.visible,
  (v) => {
    if (v) {
      getPodList()
    }
  }
)
</script>
