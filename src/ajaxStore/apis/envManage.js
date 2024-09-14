export default function (instance) {
  return {
    getPagedEnv: (data) => instance.post('/devopsapi/envconfig/page', data),
    getEnvList: (data) => instance.post('/devopsapi/envconfig/list', data),
    createEnv: (data) => instance.post('/devopsapi/envconfig/insert', data),
    deleteEnv: (data) => instance.post('/devopsapi/envconfig/delete', data),
    updateEnv: (data) => instance.post('/devopsapi/envconfig/update', data),
  }
}
