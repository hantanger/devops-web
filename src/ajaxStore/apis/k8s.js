export default function (instance) {
  return {
    // 查看对应的Pod列表
    getPodList: (data) => instance.post('/devopsapi/k8s/list', data),
  }
}
