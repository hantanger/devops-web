export default function (instance) {
  return {
    // 分页查询应用列表
    getPagedApp: (data) => instance.post('/devopsapi/app/page', data),
    // 查询全量应用列表
    getAppList: (data) => instance.post('/devopsapi/app/list', data),
    // 创建应用
    createApp: (data) => instance.post('/devopsapi/app/insert', data),
    // 删除应用
    deleteApp: (data) => instance.post('/devopsapi/app/delete', data),
    // 更新应用
    updateApp: (data) => instance.post('/devopsapi/app/update', data),
    // 查询应用详情
    getAppDetail: (data) => instance.post('/devopsapi/app/get', data),
    // 查询应用下的环境及环境分支
    getEnvBranch: (data) =>
      instance.post('/devopsapi/appdeploy/listByEnv', data),
    // 查询应用下的环境下的环境分支列表
    getBranchList: (data) => instance.post('/devopsapi/appdeploy/list', data),
    // 根据环境查询可部署应用列表
    getDeployListByEnv: (data) =>
      instance.post('/devopsapi/appdeploy/findMaterByEnvId', data),
    // 绑定环境，创建master环境分支
    craeteBranch: (data) => instance.post('/devopsapi/appdeploy/insert', data),
    // 一键创建部署环境
    fastCraeteBranch: (data) =>
      instance.post('/devopsapi/appdeploy/quickInsert', data),
    // 更新环境分支
    updateBranch: (data) => instance.post('/devopsapi/appdeploy/update', data),
    // 创建环境分支
    createEnvBranch: (data) =>
      instance.post('/devopsapi/appdeploy/insertRoutingMark', data),
    // 删除环境分支
    delEnvBranch: (data) => instance.post('/devopsapi/appdeploy/delete', data),
    // 环境分支详情
    getBranchDetail: (data) => instance.post('/devopsapi/appdeploy/get', data),
    // 查询环境分支上绑定的其他环境分支
    getBinding: (data) =>
      instance.post('/devopsapi/apppublish/findBinding', data),
    // 创建绑定关系
    createBinding: (data) =>
      instance.post('/devopsapi/apppublish/binding', data),
    // 预览dockerfile
    previewDockerfile: (data) =>
      instance.post('/devopsapi/apppublish/preview/dockerFile', data),
    // 预览k8s yaml
    previewYaml: (data) =>
      instance.post('/devopsapi/apppublish/preview/K8sYaml', data),
  }
}
