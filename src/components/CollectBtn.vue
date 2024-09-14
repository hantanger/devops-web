<template>
  <el-tooltip
    placement="top"
    :visible="visible"
    :content="checked ? '取消收藏' : '收藏'"
    :disabled="tooltipDisabled"
  >
    <el-link
      :underline="false"
      @mouseenter="visible = true"
      @mouseleave="visible = false"
      @click="clickCollect"
      :disabled="loading"
    >
      <el-icon color="#f17f42" v-if="checked" size="20px">
        <StarFilled />
      </el-icon>
      <el-icon color="#f17f42" v-else size="16px"><Star /></el-icon>
      <slot></slot>
    </el-link>
  </el-tooltip>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import ajaxStore from '@/ajaxStore'
import { useCollectStore } from '@/store/collect'

const props = defineProps({
  appId: [Number, String],
  checked: Boolean,
  tooltipDisabled: {
    type: Boolean,
    default: false,
  },
})

const { checked } = toRefs(props)

const emit = defineEmits(['success'])

const collectStore = useCollectStore()

const visible = ref(false)
const loading = ref(false)

// 确认
async function clickCollect() {
  loading.value = true
  const requestApi = checked.value
    ? ajaxStore.collectManage.removeCollect
    : ajaxStore.collectManage.collect
  const res = await requestApi({ appId: Number(props.appId) })
  loading.value = false
  if (res?.data?.code === '0') {
    visible.value = false // 如果不使用受控模式，点击后快速移开会导致tooltip不隐藏
    collectStore.getList()
    emit('success')
  }
}
</script>
