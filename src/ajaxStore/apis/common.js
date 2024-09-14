export default function (instance) {
  return {
    // 登录
    login: (data, headers) =>
      instance.post('/devopsapi/login', data, { headers }),
    // 查看应用负责人列表
    getAppOwners: (data) => instance.post('/devopsapi/getUser', data),
  }
}
