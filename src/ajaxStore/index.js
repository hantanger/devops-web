import instance from './instance'
import getCommonApis from './apis/common'
import getGitlabApis from './apis/gitlab'
import getAppManageApis from './apis/appManage'
import getEnvManageApis from './apis/envManage'
import getTplManageApis from './apis/tplManage'
import getPublishManage from './apis/publishManage'
import getCollectManage from './apis/collectManage'
import getBranchManage from './apis/branchManage'
import getK8s from './apis/k8s'

export default {
  common: getCommonApis(instance),
  gitlab: getGitlabApis(instance),
  appManage: getAppManageApis(instance),
  envManage: getEnvManageApis(instance),
  tplManage: getTplManageApis(instance),
  publishManage: getPublishManage(instance),
  collectManage: getCollectManage(instance),
  branchManage: getBranchManage(instance),
  k8s: getK8s(instance),
}
