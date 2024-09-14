import { ref, unref } from 'vue'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({ formRef, mode, id }) {
  const formData = ref({
    name: '',
    commonData: '',
    harborProject: '',
    jenkinsUrl: '',
    jenkinsToken: '',
    jenkinsNode: '',
    k8sNamespace: '',
    k8sApiserver: '',
    k8sToken: '',
    suffix: '',
    isSupportFeatureEnv: '', // 是否支持特性环境 支持:1,不支持:0
    orderBy: null, // 排序
    remark: '',
  })
  const formRules = {
    name: [{ required: true, message: '请输入环境名称' }],
    commonData: [{ required: true, message: '请输入通用配置' }],
    harborProject: [{ required: true, message: '请输入Harbor Project' }],
    jenkinsUrl: [{ required: true, message: '请输入Jenkins Url' }],
    jenkinsToken: [{ required: true, message: '请输入Jenkins Token' }],
    jenkinsNode: [{ required: true, message: '请输入Jenkins Node' }],
    k8sNamespace: [{ required: true, message: '请输入K8s Namespace' }],
    k8sApiserver: [{ required: true, message: '请输入K8s Apiserver' }],
    k8sToken: [{ required: true, message: '请输入K8s Token' }],
    suffix: [{ required: true, message: '请输入后缀' }],
    orderBy: [{ required: true, message: '请输入排序' }],
    isSupportFeatureEnv: [{ required: true, message: '请选择' }],
  }
  const { resetFields, setFormData } = useForm({ formRef, formData })

  const loading = ref(false)

  function submit(cb) {
    formRef.value.validate(async (v) => {
      if (!v) return

      loading.value = true
      let requestApi = ajaxStore.envManage.createEnv
      const params = unref(formData)
      if (mode.value === 'edit') {
        params.id = id.value
        requestApi = ajaxStore.envManage.updateEnv
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
