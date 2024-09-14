<template>
  <el-dialog
    title="请选择续期周期"
    width="400px"
    :model-value="visible"
    @close="emit('close')"
  >
    <el-radio-group v-model="renewTypeRadio">
      <el-radio v-for="item in renewTypeOptions" :label="item.value">
        {{ item.label }}
      </el-radio>
    </el-radio-group>
    <template #footer>
      <el-button @click="clickSure" type="primary" :loading="loading">
        确定
      </el-button>
      <el-button @click="emit('close')">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { renewType } from '@/const/enum'
import { objectToOptions } from '@/utils/util'
import ajaxStore from '@/ajaxStore'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: Boolean,
  id: [String, Number],
})

const emit = defineEmits(['close', 'success'])

const renewTypeOptions = objectToOptions(renewType)

const renewTypeRadio = ref(null)
const loading = ref(false)

async function clickSure() {
  loading.value = true
  const res = await ajaxStore.branchManage.renew({
    id: props.id,
    renewType: renewTypeRadio.value,
  })
  loading.value = false
  if (res.data?.code === '0') {
    ElMessage.success('续期成功')
    emit('success')
  }
}
</script>
