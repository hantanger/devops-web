<template>
  <el-dialog
    title="一键创建部署环境"
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
      <el-form-item label="新环境" prop="envId">
        <el-select
          class="w-full"
          filterable
          placeholder=" "
          v-model="formData.envId"
          @change="changeEnv"
        >
          <el-option
            v-for="item in envOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板应用" prop="templateAppId">
        <el-select
          class="w-full"
          filterable
          placeholder=" "
          :disabled="!formData.envId"
          v-model="formData.templateAppId"
        >
          <el-option
            v-for="item in templateAppOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="item.disabled"
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

<script setup>
import { ref, toRefs, watch } from 'vue'
import useForm from './useForm'
import useOptions from './useOptions'

const props = defineProps({
  visible: Boolean,
  appId: String,
  appType: String,
  bindedEnvList: Array,
})

const { appId, appType, bindedEnvList } = toRefs(props)

const emit = defineEmits(['close', 'success'])

const formRef = ref()

// 表单
const { formData, formRules, loading, submit, resetFields } = useForm({
  formRef,
  appId,
})

// 下拉框option
const { envOptions, templateAppOptions, getTemplateAppList, initOptions } =
  useOptions({
    appId,
    appType,
    bindedEnvList,
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

function changeEnv() {
  formData.value.templateAppId = undefined
  if (formData.value.envId) {
    getTemplateAppList(formData.value.envId)
  }
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
