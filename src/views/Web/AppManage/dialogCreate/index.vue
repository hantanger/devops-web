<template>
  <el-dialog
    width="600px"
    :title="title"
    :model-value="visible"
    @close="close"
    @opened="opened"
  >
    <!-- 表单 -->
    <el-form
      ref="formRef"
      label-width="100px"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="应用名称" prop="name">
        <el-input max-length="50" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="应用类型" prop="appType">
        <el-radio-group v-model="formData.appType">
          <el-radio
            v-for="item in appTypeOptions"
            :label="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Git地址" prop="gitProjectUrl">
        <el-input max-length="50" v-model="formData.gitProjectUrl"></el-input>
      </el-form-item>
      <el-form-item label="应用负责人" prop="appOwner">
        <el-select
          class="w-full"
          filterable
          multiple
          placeholder=" "
          v-model="formData.appOwner"
        >
          <el-option
            v-for="item in appOwnerOptions"
            :key="item.uid"
            :label="`${item.uid}`"
            :value="item.uid"
          ></el-option>
        </el-select>
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
import useForm from './useForm'
import useOptions from './useOptions'

const props = defineProps({
  visible: Boolean,
  mode: String, // 模式：'create', 'edit'
  id: Number,
  editData: Object,
})

const emit = defineEmits(['success', 'close'])

const { mode, id } = toRefs(props)
const title = computed(() =>
  mode.value === 'create' ? '创建应用' : '编辑应用'
)

const formRef = ref()

const { formData, formRules, loading, submit, resetFields, setFormData } =
  useForm({
    formRef,
    mode,
    id,
  })

const { appTypeOptions, appOwnerOptions } = useOptions()

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
