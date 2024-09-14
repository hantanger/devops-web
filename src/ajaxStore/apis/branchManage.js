export default function (instance) {
  return {
    // 分页查询环境分支列表
    getPagedBranch: (data) => instance.post('/devopsapi/appdeploy/page', data),
    // 批量删除环境分支
    batchDeleteBranch: (data) =>
      instance.post('/devopsapi/appdeploy/cleanRoutingMark', data),
    // 批量创建环境分支
    batchCreateBranch: (data) =>
      instance.post('/devopsapi/appdeploy/sprintBranch', data),
    // 查询指定环境的应用列表，并判断是否有指定的环境分支
    findAppByRoutingMark: (data) =>
      instance.post('/devopsapi/appdeploy/findTagByRoutingMark', data),
    // 续期
    renew: (data) => instance.post('/devopsapi/appdeploy/renew', data),
  }
}
