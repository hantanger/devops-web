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
      <el-form-item label="环境名称" prop="name">
        <el-input max-length="50" v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="通用配置" prop="commonData">
        <el-input
          max-length="500"
          type="textarea"
          autosize
          v-model="formData.commonData"
        ></el-input>
      </el-form-item>

      <el-form-item label="Harbor Project" prop="harborProject">
        <el-input max-length="50" v-model="formData.harborProject"></el-input>
      </el-form-item>

      <el-form-item label="Jenkins Url" prop="jenkinsUrl">
        <el-input max-length="50" v-model="formData.jenkinsUrl"></el-input>
      </el-form-item>

      <el-form-item label="Jenkins Token" prop="jenkinsToken">
        <el-input max-length="50" v-model="formData.jenkinsToken"></el-input>
      </el-form-item>

      <el-form-item label="Jenkins Node" prop="jenkinsNode">
        <el-input max-length="50" v-model="formData.jenkinsNode"></el-input>
      </el-form-item>

      <el-form-item label="K8s Namespace" prop="k8sNamespace">
        <el-input max-length="50" v-model="formData.k8sNamespace"></el-input>
      </el-form-item>

      <el-form-item label="K8s Apiserver" prop="k8sApiserver">
        <el-input max-length="50" v-model="formData.k8sApiserver"></el-input>
      </el-form-item>

      <el-form-item label="K8s Token" prop="k8sToken">
        <el-input
          max-length="1000"
          type="textarea"
          autosize
          v-model="formData.k8sToken"
        ></el-input>
      </el-form-item>

      <el-form-item label="后缀" prop="suffix">
        <el-input max-length="50" v-model="formData.suffix"></el-input>
      </el-form-item>

      <el-form-item label="排序" prop="orderBy">
        <el-input-number
          :min="0"
          :max="100"
          v-model="formData.orderBy"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="特性环境" prop="isSupportFeatureEnv">
        <el-radio-group v-model="formData.isSupportFeatureEnv">
          <el-radio
            v-for="item in supportSubEnvOptions"
            :label="Number(item.value)"
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
import { supportSubEnv } from '@/const/enum'
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
  mode.value === 'create' ? '创建环境' : '编辑环境'
)

const formRef = ref()

const { formData, formRules, loading, submit, resetFields, setFormData } =
  useForm({
    formRef,
    mode,
    id,
  })

// 应用类型配置项
const supportSubEnvOptions = objectToOptions(supportSubEnv)

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
