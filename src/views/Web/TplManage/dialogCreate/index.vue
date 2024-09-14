<template>
  <el-dialog
    width="800px"
    :title="title"
    :model-value="visible"
    @close="close"
    @opened="opened"
  >
    <!-- 表单 -->
    <el-form
      ref="formRef"
      label-width="140px"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="模板名称" prop="name">
        <el-input max-length="50" v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="模板内容" prop="content">
        <el-input
          max-length="500"
          type="textarea"
          autosize
          v-model="formData.content"
        ></el-input>
      </el-form-item>

      <el-form-item label="模板类型" prop="templateType">
        <el-radio-group v-model="formData.templateType">
          <el-radio
            v-for="item in templateTypeOptions"
            :label="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" max-length="200"></el-input>
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

<script setup>
import { ref, toRefs, computed } from 'vue'
import { templateType } from '@/const/enum'
import { objectToOptions } from '@/utils/util'
import useForm from './useForm'

const props = defineProps({
  visible: Boolean,
  mode: String, // 模式：'create', 'edit'
  id: Number,
  editData: Object,
})

const emit = defineEmits(['success', 'close'])

const { mode, id } = toRefs(props)
const title = computed(() =>
  mode.value === 'create' ? '创建模板' : '编辑模板'
)

const formRef = ref()

const { formData, formRules, loading, submit, resetFields, setFormData } =
  useForm({
    formRef,
    mode,
    id,
  })

// 应用类型配置项
const templateTypeOptions = objectToOptions(templateType)

// 点击确认
function clickSure() {
  submit(() => {
    // 提交成功后的回调
    emit('success')
  })
}

// 关闭对话框
function close() {
  resetFields()
  emit('close')
}

// 打开对话框
function opened() {
  if (mode.value === 'edit') {
    setFormData(props.editData)
  }
}
</script>
