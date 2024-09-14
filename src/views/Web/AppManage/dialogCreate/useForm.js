import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({ formRef, mode, id }) {
  const formData = ref({
    name: '',
    appType: '',
    gitProjectUrl: '',
    appOwner: [],
    remark: '',
  })
  const formRules = {
    name: [{ required: true, message: '请输入应用名称' }],
    appType: [{ required: true, message: '请选择应用类型' }],
    gitProjectUrl: [{ required: true, message: '请输入git地址' }],
    appOwner: [{ required: true, message: '请输入应用负责人' }],
  }
  const { resetFields, setFormData } = useForm({ formRef, formData })

  const loading = ref(false)

  function submit(cb) {
    formRef.value.validate(async (v) => {
      if (!v) return

      loading.value = true
      let requestApi = ajaxStore.appManage.createApp
      const params = Object.assign({}, formData.value)
      params.appOwner = params.appOwner.join(',')
      if (mode.value === 'edit') {
        params.id = id.value
        requestApi = ajaxStore.appManage.updateApp
      }
      const res = await requestApi(params)
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
    setFormData,
  }
}
