import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'

export default function () {
  const state = ref({
    visible: false,
    dockerfile: '',
    yaml: '',
  })

  const loading = ref(false)

  // 显示弹框
  async function show(branchId) {
    state.value.visible = true
    loading.value = true
    const resDocker = await ajaxStore.appManage.previewDockerfile({
      data: branchId,
    })
    const resYaml = await ajaxStore.appManage.previewYaml({
      data: branchId,
    })
    loading.value = false
    state.value.dockerfile = resDocker?.data?.data
    state.value.yaml = resYaml?.data?.data
  }

  // 隐藏弹框
  function hide() {
    state.value.visible = false
  }

  return {
    state,
    loading,
    show,
    hide,
  }
}
