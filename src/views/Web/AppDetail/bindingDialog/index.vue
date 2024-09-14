<template>
  <el-dialog
    title="绑定环境分支"
    width="500px"
    :model-value="visible"
    @close="close"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      :model="formData"
      v-loading="initLoading"
    >
      <el-form-item label="环境分支" prop="appDeployIds">
        <el-checkbox-group
          v-if="envOptions && envOptions.length"
          v-model="formData.appDeployIds"
        >
          <el-checkbox
            v-for="item in envOptions"
            :key="item.id"
            :label="item.id"
          >
            <div>
              <span>{{ item.routingMark }}</span>
              <span style="margin-left: 10px; color: #ccc">
                ({{ item.gitBranch }})
              </span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
        <div v-else>
          <div>暂无</div>
          <div class="flex items-center">
            <el-icon class="mr-5" color="#f17f42"><InfoFilled /></el-icon>
            请先创建环境分支
          </div>
        </div>
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

<script setup name="BindingDialog">
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
const { formData, loading, initLoading, submit, resetFields, setFormData } =
  useForm({
    formRef,
    branchId,
  })

// 下拉框option
const { envOptions, initOptions } = useOptions({
  branchId,
})

// 点击确认
function clickSure() {
  submit(() => {
    // 提交成功后的回调
    emit('success')
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
