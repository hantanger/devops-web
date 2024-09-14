import { ref, unref } from 'vue'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({ formRef, appId }) {
  const formData = ref({
    envId: undefined,
    templateAppId: undefined,
  })

  const formRules = {
    envId: [{ required: true, message: '请选择环境', trigger: 'blur' }],
    templateAppId: [
      { required: true, message: '请选择模板应用', trigger: 'blur' },
    ],
  }
  const { resetFields } = useForm({
    formRef,
  })

  const loading = ref(false) // submit的loading

  function submit(cb) {
    formRef.value.validate(async (v) => {
      if (!v) return

      loading.value = true
      const params = unref(formData)
      params.appId = Number(appId.value)
      const res = await ajaxStore.appManage.fastCraeteBranch(params)
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
  }
}
