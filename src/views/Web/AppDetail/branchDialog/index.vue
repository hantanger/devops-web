<template>
  <el-dialog
    title="创建环境分支"
    width="500px"
    :model-value="visible"
    @close="close"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="环境分支" prop="routingMark">
        <el-input maxlength="20" v-model="formData.routingMark"></el-input>
      </el-form-item>

      <el-form-item label="Git分支" prop="gitBranch">
        <el-select
          class="w-full"
          filterable
          :placeholder="' '"
          v-model="formData.gitBranch"
        >
          <el-option
            v-for="item in gitBranchOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
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

<script setup name="BranchDialog">
import { ref, toRefs, watch } from 'vue'
import useForm from './useForm'
import useOptions from './useOptions'

const props = defineProps({
  visible: Boolean,
  appId: String,
  envId: Number,
})

const { appId, envId } = toRefs(props)

const emit = defineEmits(['close', 'success'])
const formRef = ref()

// 表单
const { formData, formRules, loading, submit, resetFields } = useForm({
  formRef,
  appId,
  envId,
})

// 下拉框option
const { gitBranchOptions, initOptions } = useOptions({
  appId,
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
    }
  }
)
</script>

<style scoped></style>
