import { ref, unref } from 'vue'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({ formRef, appId, envId }) {
  const formData = ref({
    routingMark: '',
    gitBranch: '',
  })

  const formRules = {
    routingMark: [
      {
        required: true,
        message: '请输入环境分支，字符必须为数字、小写字母',
        pattern: /^[0-9a-z]*$/,
      },
    ],
    gitBranch: [{ required: true, message: '请选择Git分支' }],
  }

  const { resetFields, setFormDataItem } = useForm({
    formRef,
    formData,
  })

  const loading = ref(false) // submit的loading

  function submit(cb) {
    formRef.value.validate(async (v) => {
      if (!v) return

      const params = unref(formData)
      params.appId = appId.value
      params.envId = envId.value
      loading.value = true
      const res = await ajaxStore.appManage.createEnvBranch(params)
      loading.value = false
      if (res?.data?.code === '0') {
        cb && cb()
      }
    })
  }

  return {
    formData,
    formRules,
    loading,
    submit,
    resetFields,
    setFormDataItem,
  }
}
