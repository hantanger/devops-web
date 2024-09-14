export default function (instance) {
  return {
    // 发布
    publish: (data) => instance.post('/devopsapi/apppublish/publish', data),
    // 批量发布
    batchPublish: (data) =>
      instance.post('/devopsapi/appPublishOrder/insert', data),
    // online紧急发布
    emergencyPublish: (data) =>
      instance.post('/devopsapi/apppublish/onlineEmergencyPublish', data),
    // testa紧急发布
    emergencyPublishTesta: (data) =>
      instance.post('/devopsapi/apppublish/testAEmergencyPublish', data),
    // 终止
    exit: (data) =>
      instance.post('/devopsapi/apppublishdetail/terminate', data),
    // 回滚
    rollback: (data) => instance.post('/devopsapi/apppublish/rollback', data),
    // 查询发布日志
    getLog: (data) => instance.post('/devopsapi/apppublishdetail/log', data),
    // 查询发布状态
    getStatus: (data) =>
      instance.post('/devopsapi/apppublishdetail/getPublishStatus', data),
    // 查询发布详情
    getDetail: (data) => instance.post('/devopsapi/apppublishdetail/get', data),
    // 查询发布列表
    getPagedPublish: (data) =>
      instance.post('/devopsapi/apppublishdetail/page', data),
    // 查询发布单列表
    getPagedPublishOrder: (data) =>
      instance.post('/devopsapi/appPublishOrder/list', data),
  }
}
