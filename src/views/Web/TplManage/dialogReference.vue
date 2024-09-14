<template>
  <el-dialog
    width="800px"
    title="查看引用此模板的应用"
    :model-value="visible"
    @close="emit('close')"
  >
    <el-alert
      type="info"
      show-icon
      :title="`共有${tableList.length}条引用`"
      :closable="false"
    />
    <el-table
      class="mt-10"
      border
      max-height="380"
      empty-text="暂无数据"
      :data="tableList"
      :span-method="spanMethod"
      v-loading="loading"
    >
      <el-table-column prop="appName" label="应用名称">
        <template #default="{ row }">
          <router-link :to="{ name: 'appDetail', query: { appId: row.appId } }">
            {{ row.appName }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="envName" label="环境名称" />
      <el-table-column prop="routingMark" label="环境分支" />
      <el-table-column prop="gitBranch" label="Git分支" />
    </el-table>
    <!-- 底部按钮 -->
    <template #footer>
      <el-button plain :loading="loading" @click="emit('close')">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import ajaxStore from '@/ajaxStore'

const props = defineProps({
  visible: Boolean,
  id: Number || String,
})

const emit = defineEmits(['close'])

// 表格数据
const tableList = ref([])
const loading = ref(false)

// 合并单元格
function spanMethod({ row, columnIndex }) {
  if (columnIndex === 0) {
    if (row.spanLen) {
      return {
        rowspan: row.spanLen,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

async function getTableList() {
  tableList.value = []
  loading.value = true
  const res = await ajaxStore.tplManage.findReference({
    data: Number(props.id),
  })
  loading.value = false
  if (res?.data?.code === '0') {
    const data = res?.data?.data ?? {}
    const dataList = []
    Object.keys(data).forEach((appName) => {
      const routingMarkList = data[appName] ?? []
      routingMarkList.forEach((item, index) => {
        const obj = {
          appName,
          appId: item.appId,
          envId: item.envId,
          routingMark: item.routingMark,
          envName: item.envName,
          gitBranch: item.gitBranch,
        }
        if (index === 0) {
          // 每个应用的第一行设置应用数量，用于合并单元格
          obj.spanLen = routingMarkList.length
        }
        dataList.push(obj)
      })
    })
    tableList.value = dataList
  }
}

watch(
  () => props.visible,
  (v) => {
    if (v) {
      getTableList()
    }
  }
)
</script>
