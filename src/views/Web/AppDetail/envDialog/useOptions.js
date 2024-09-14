import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'
import { containerImagePullPolicy } from '@/const/enum'
import { objectToOptions } from '@/utils/util'

export default function ({ appId, bindedEnvList }) {
  const envOptions = ref([])
  const gitBranchOptions = ref([])
  const dockfileTplOptions = ref([])
  const yamlTplOptions = ref([])
  const policyOptions = ref(objectToOptions(containerImagePullPolicy))

  // 查询环境
  async function getEnvList() {
    const res = await ajaxStore.envManage.getEnvList({})
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      const data = res.data.data
      if (bindedEnvList?.value?.length) {
        envOptions.value = data.map(({ id, name }) => ({
          id,
          name,
          disabled: bindedEnvList.value.indexOf(id) >= 0,
        }))
      } else {
        envOptions.value = data.map(({ id, name }) => ({
          id,
          name,
          disabled: false,
        }))
      }
    }
  }

  // 查询git分支
  async function getGitBranch() {
    const res = await ajaxStore.gitlab.getBranch({ data: appId.value })
    if (res?.data?.code === '0') {
      gitBranchOptions.value = res?.data?.data ?? []
    }
  }

  // 查询所有模板并分类
  async function getTplList() {
    const dockfileOptions = []
    const yamlOptions = []
    const res = await ajaxStore.tplManage.getTplList({})
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      const data = res.data.data
      data.forEach((item) => {
        switch (item.templateType) {
          case '1':
            dockfileOptions.push(item)
            break
          case '2':
            yamlOptions.push(item)
            break
          default:
            break
        }
      })
    }
    dockfileTplOptions.value = dockfileOptions
    yamlTplOptions.value = yamlOptions
  }

  function initOptions() {
    getEnvList()
    getGitBranch()
    getTplList()
  }
  return {
    envOptions,
    gitBranchOptions,
    dockfileTplOptions,
    yamlTplOptions,
    policyOptions,
    initOptions,
  }
}
