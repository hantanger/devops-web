import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({ formRef, branchId }) {
  const formData = ref({
    appDeployIds: [],
  })

  const { resetFields, setFormData } = useForm({
    formRef,
    formData,
  })

  const loading = ref(false) // submit的loading

  function submit(cb) {
    formRef.value.validate(async (v) => {
      if (!v) return

      loading.value = true
      const params = Object.assign({}, formData.value)
      params.appDeployId = branchId.value
      const res = await ajaxStore.appManage.createBinding(params)
      loading.value = false
      if (res?.data?.code === '0') {
        cb && cb()
      }
    })
  }

  return {
    formData,
    loading,
    submit,
    resetFields,
    setFormData,
  }
}
