import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({ formRef, branchId }) {
  const formData = ref({
    type: 'self',
    appDeployIds: undefined,
  })

  const formRules = {
    type: [{ required: true, message: '请选择发布方式', trigger: 'change' }],
    appDeployIds: [
      {
        required: true,
        trigger: 'change',
        validator(rule, value, callback) {
          if (formData.value.type === 'self') {
            callback()
          } else if (
            formData.value.appDeployIds &&
            formData.value.appDeployIds.length > 0
          ) {
            callback()
          } else {
            callback(new Error('请选择环境分支'))
          }
        },
      },
    ],
  }

  const { resetFields, setFormData } = useForm({
    formRef,
    formData,
  })

  const loading = ref(false) // submit的loading

  function submit(cb) {
    formRef.value.validate(async (v) => {
      if (!v) return

      loading.value = true
      const params = {
        appDeployId: branchId.value,
        appDeployIds: [],
      }
      params.appDeployId = branchId.value
      params.appDeployIds.push(
        formData.value.type === 'self'
          ? branchId.value
          : formData.value.appDeployIds
      )
      const res = await ajaxStore.publishManage.emergencyPublish(params)
      loading.value = false
      if (res?.data?.code === '0') {
        cb && cb(res)
      }
    })
  }

  return {
    formData,
    formRules,
    loading,
    submit,
    resetFields,
    setFormData,
  }
}
