<template>
  <el-select
    filterable
    v-model="appId"
    :placeholder="placeholder"
    :loading="loading"
    @change="changeApp"
  >
    <el-option
      v-for="item in appOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ajaxStore from '@/ajaxStore'

const props = defineProps({
  defaultAppId: [String, Number],
  placeholder: {
    type: String,
    default: ' ',
  },
})

const emit = defineEmits(['changeApp'])

const router = useRouter()

const appId = ref(
  props.defaultAppId !== undefined ? Number(props.defaultAppId) : undefined
)
const loading = ref(false)
const appOptions = ref([])

// app选择器的下拉选项
async function getOptions() {
  loading.value = true
  const res = await ajaxStore.appManage.getAppList({})
  loading.value = false
  if (res?.data?.code === '0' && res.data?.data?.length) {
    appOptions.value = res.data.data.map(({ id, name }) => ({ id, name }))
  }
}

// 变更app则刷新页面
function changeApp(v) {
  router.push({ name: 'appDetail', query: { appId: v } })
  emit('changeApp')
}

function setAppId(v) {
  appId.value = v !== undefined ? Number(v) : undefined
}

defineExpose({
  setAppId,
})

getOptions()
</script>
