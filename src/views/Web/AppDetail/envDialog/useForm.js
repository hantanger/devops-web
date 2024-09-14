import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deepCopy } from '@/utils/util'
import ajaxStore from '@/ajaxStore'
import useForm from '@/hooks/useForm'

export default function ({
  formRef,
  deployVolumesRef,
  containerAppPortsRef,
  containerEnvParamsRef,
  containerResourcesRef,
  containerLivenessProbeRef,
  containerReadinessProbeRef,
  containerVolumeMountsRef,
  mode,
  appId,
  branchId,
}) {
  // Pod卷数据的校验
  function deployVolumesRule(rule, value, callback) {
    const tableData = deployVolumesRef.value.tableData
    if (tableData?.length) {
      for (let i = 0; i < tableData.length; i++) {
        const { name, type, value } = tableData[i]
        if (!name || !type || (type !== 'emptyDir' && !value)) {
          callback(new Error('卷名称、类型、值不能为空'))
          return
        }
      }
    }
    callback()
  }
  // 端口配置的校验
  function containerAppPortsRule(rule, value, callback) {
    const arr = JSON.parse(containerAppPortsRef.value.getData())
    if (arr?.length) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].containerPort || !arr[i].name) {
          callback(new Error('端口名称和容器端口不能为空'))
          return
        }
      }
      callback()
    } else {
      callback(new Error('请填写端口配置'))
    }
  }
  // 环境参数的校验
  function containerEnvParamsRule(rule, value, callback) {
    const arr = JSON.parse(containerEnvParamsRef.value.getData())
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (!item.name) {
        callback(new Error('环境变量名不能为空'))
        return
      }
      if (
        !item.name &&
        (!item?.valueFrom?.configMapKeyRef?.key ||
          !item?.valueFrom?.configMapKeyRef?.name) &&
        (!item?.valueFrom?.secretKeyRef?.key ||
          !item?.valueFrom?.secretKeyRef?.name)
      ) {
        callback(new Error('值不能为空'))
        return
      }
    }
    callback()
  }

  // 挂载卷的校验
  function containerVolumeMountsRule(rule, value, callback) {
    const arr = JSON.parse(containerVolumeMountsRef.value.getData())
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (!item.name || !item.mountPath) {
        callback(new Error('卷名称和挂载路径不能为空'))
        return
      }
    }
    callback()
  }

  const defaultData = {
    envId: '',
    buildCmd: '',
    buildDockerfileTemplateId: '',
    buildTarget: '',
    containerAppPorts: '', // require
    containerEnvParams: '',
    containerImagePullPolicy: '', // require
    containerJvm: '',
    containerLivenessProbe: '',
    containerReadinessProbe: '',
    containerResources: '',
    containerVolumeMounts: '',
    deployNodeAffinity: '',
    deployReplicas: 1,
    deployVolumes: '',
    deployYamlTemplateId: '',
    // expireTime: "",
    routingMark: 'master',
    gitBranch: 'master',
    remark: '',
    containerCommand: '',
    containerCommandArgs: '',
  }

  const formData = ref(deepCopy(defaultData))

  const formRules = {
    envId: [{ required: true, message: '请选择环境' }],
    routingMark: [{ required: true, message: '请输入环境分支' }],
    gitBranch: [{ required: true, message: '请选择Git分支' }],
    buildDockerfileTemplateId: [
      { required: true, message: '请选择Dockerfile模板' },
    ],
    deployYamlTemplateId: [{ required: true, message: '请选择YAML模板' }],
    deployReplicas: [{ required: true, message: '请输入副本数量' }],
    deployVolumes: [{ validator: deployVolumesRule }],
    containerAppPorts: [
      {
        required: true,
        validator: containerAppPortsRule,
      },
    ],
    containerEnvParams: [{ validator: containerEnvParamsRule }],
    containerVolumeMounts: [{ validator: containerVolumeMountsRule }],
    containerImagePullPolicy: [
      { required: true, message: '请输入镜像获取策略' },
    ],
  }

  const { setFormData, setFormDataItem } = useForm({
    formRef,
    formData,
  })

  const loading = ref(false) // submit的loading
  const initLoading = ref(false) // edit状态查询详情时的loading

  // 编辑状态初始化详情
  async function initDetail() {
    initLoading.value = true
    const res = await ajaxStore.appManage.getBranchDetail({
      id: branchId.value,
    })
    initLoading.value = false
    if (res?.data?.code === '0') {
      const {
        envId,
        buildCmd,
        buildDockerfileTemplateId,
        buildTarget,
        containerAppPorts,
        containerEnvParams,
        containerImagePullPolicy,
        containerJvm,
        containerLivenessProbe,
        containerReadinessProbe,
        containerResources,
        containerVolumeMounts,
        deployNodeAffinity,
        deployReplicas,
        deployVolumes,
        deployYamlTemplateId,
        // expireTime,
        routingMark,
        gitBranch,
        remark,
        containerCommand,
        containerCommandArgs,
      } = res?.data?.data
      setFormData({
        envId,
        buildCmd,
        buildDockerfileTemplateId,
        buildTarget,
        containerAppPorts,
        containerEnvParams,
        containerImagePullPolicy,
        containerJvm,
        containerLivenessProbe,
        containerReadinessProbe,
        containerResources,
        containerVolumeMounts,
        deployNodeAffinity,
        deployReplicas,
        deployVolumes,
        deployYamlTemplateId,
        // expireTime,
        routingMark,
        gitBranch,
        remark,
        containerCommand,
        containerCommandArgs,
      })

      deployVolumesRef.value.setData(deployVolumes)
      containerAppPortsRef.value.setData(containerAppPorts)
      containerEnvParamsRef.value.setData(containerEnvParams)
      containerResourcesRef.value.setData(containerResources)
      containerLivenessProbeRef.value.setData(containerLivenessProbe)
      containerReadinessProbeRef.value.setData(containerReadinessProbe)
      containerVolumeMountsRef.value.setData(containerVolumeMounts)
    }
  }

  // 因整个表单使用tab分割了，所以错误的表单项可能不在前端tab，所以错误信息需要用message提示
  function showErrorMessage(invalidFields) {
    if (!invalidFields) return

    const msgs = []
    Object.entries(invalidFields).forEach((arr) => {
      arr?.[1]?.[0]?.message && msgs.push(arr[1][0].message)
    })

    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: msgs.join('<br>'),
      duration: 10000,
    })
  }

  // 提交
  function submit(cb) {
    formRef.value.validate(async (v, invalidFields) => {
      showErrorMessage(invalidFields)
      if (!v) return

      loading.value = true
      let requestApi = ajaxStore.appManage.craeteBranch
      const params = formData.value

      params.deployVolumes = deployVolumesRef.value.getData()
      params.containerAppPorts = containerAppPortsRef.value.getData()
      params.containerEnvParams = containerEnvParamsRef.value.getData()
      params.containerResources = containerResourcesRef.value.getData()
      params.containerLivenessProbe = containerLivenessProbeRef.value.getData()
      params.containerReadinessProbe =
        containerReadinessProbeRef.value.getData()
      params.containerVolumeMounts = containerVolumeMountsRef.value.getData()

      if (mode.value === 'edit') {
        params.id = branchId.value
        requestApi = ajaxStore.appManage.updateBranch
      } else {
        params.appId = appId.value
      }
      const res = await requestApi(params)
      loading.value = false
      if (res?.data?.code === '0') {
        cb && cb()
      }
    })
  }

  function resetFieldsAll() {
    deployVolumesRef.value.resetFields()
    containerAppPortsRef.value.resetFields()
    containerEnvParamsRef.value.resetFields()
    containerResourcesRef.value.resetFields()
    containerLivenessProbeRef.value.resetFields()
    containerReadinessProbeRef.value.resetFields()
    containerVolumeMountsRef.value.resetFields()
    formRef.value.resetFields()
  }

  return {
    formData,
    formRules,
    loading,
    initLoading,
    submit,
    initDetail,
    resetFieldsAll,
    setFormDataItem,
  }
}
