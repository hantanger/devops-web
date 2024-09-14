<template>
  <el-popconfirm
    confirm-button-text="是"
    cancel-button-text="否"
    :title="confirmTitle"
    @confirm="confirm()"
  >
    <template #reference>
      <el-button plain :type="btnType" :disabled="disabled" :loading="loading">
        {{ btnText }}
      </el-button>
    </template>
  </el-popconfirm>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  requestApi: {
    type: Function,
  },
  params: Object,
  btnType: {
    type: String,
    default: 'default',
  },
  confirmTitle: {
    type: String,
    default: '是否确认？',
  },
  btnText: {
    type: String,
    default: '操作',
  },
  successText: {
    type: String,
    default: '操作成功',
  },
  disabled: Boolean,
})

const emit = defineEmits(['confirm', 'success'])

const loading = ref(false)

// 确认
async function confirm() {
  emit('confirm')
  loading.value = true
  const res = await props.requestApi(props.params)
  loading.value = false
  if (res?.data?.code === '0') {
    ElMessage.success(props.successText)
    emit('success', res)
  }
}
</script>
