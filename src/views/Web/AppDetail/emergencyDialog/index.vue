<template>
  <el-dialog
    title="紧急发布"
    width="600px"
    :model-value="visible"
    @close="close"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      :model="formData"
      :rules="formRules"
      v-loading="initLoading"
    >
      <el-form-item label="发布方式" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="环境分支"
        prop="appDeployIds"
        v-show="formData.type === 'branch'"
      >
        <el-radio-group
          v-if="branchOptions.length"
          v-model="formData.appDeployIds"
        >
          <el-radio
            v-for="item in branchOptions"
            :key="item.id"
            :label="item.id"
          >
            <div>
              <span>{{ item.routingMark }}</span>
              <span style="margin-left: 10px; color: #ccc">
                ({{ item.gitBranch }})
              </span>
            </div>
          </el-radio>
        </el-radio-group>
        <span v-else class="color-text-secondary flex items-center">
          <el-icon><InfoFilled /></el-icon>
          请先添加Testa环境分支
        </span>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button plain :loading="loading" @click="emit('close')">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="clickSure">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup name="EmergencyDialog">
import { ref, toRefs, watch } from 'vue'
import useForm from './useForm'
import useOptions from './useOptions'

const props = defineProps({
  visible: Boolean,
  branchId: Number,
  editData: Object,
})

const { branchId } = toRefs(props)

const emit = defineEmits(['close', 'success'])

const formRef = ref()

// 表单
const {
  formData,
  formRules,
  loading,
  initLoading,
  submit,
  resetFields,
  setFormData,
} = useForm({
  formRef,
  branchId,
})

// 下拉框option
const { typeOptions, branchOptions, initOptions } = useOptions({
  branchId,
})

// 点击确认
function clickSure() {
  submit((res) => {
    // 提交成功后的回调
    emit('success', res)
  })
}

// 关闭对话框
function close() {
  emit('close')
  resetFields()
}

watch(
  () => props.visible,
  (v) => {
    if (v) {
      initOptions()
      setFormData(props.editData)
    }
  }
)
</script>
