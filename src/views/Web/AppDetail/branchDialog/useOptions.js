import { ref } from 'vue'
import ajaxStore from '@/ajaxStore'

export default function ({ appId }) {
  const gitBranchOptions = ref([])

  // 查询git分支
  async function getGitBranch() {
    const res = await ajaxStore.gitlab.getBranch({ data: appId.value })
    if (res?.data?.code === '0') {
      gitBranchOptions.value = res?.data?.data ?? []
    }
  }

  function initOptions() {
    getGitBranch()
  }
  return {
    gitBranchOptions,
    initOptions,
  }
}
