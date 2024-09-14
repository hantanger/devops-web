import { ref, unref } from 'vue'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({ formRef, mode, id }) {
  const formData = ref({
    name: '',
    content: '',
    templateType: '', // 模板类型：dockerfile:1;  yaml:2;  image:3
    remark: '',
  })
  const formRules = {
    name: [{ required: true, message: '请输入模板名称' }],
    content: [{ required: true, message: '请输入模板内容' }],
    templateType: [{ required: true, message: '请选择模板类型' }],
  }
  const { resetFields, setFormData } = useForm({ formRef, formData })

  const loading = ref(false)

  function submit(cb) {
    formRef.value.validate(async (v) => {
      if (!v) return

      loading.value = true
      let requestApi = ajaxStore.tplManage.createTpl
      const params = unref(formData)
      if (mode.value === 'edit') {
        params.id = id.value
        requestApi = ajaxStore.tplManage.updateTpl
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
