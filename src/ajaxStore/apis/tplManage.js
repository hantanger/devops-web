export default function (instance) {
  return {
    getPagedTpl: (data) =>
      instance.post('/devopsapi/configtemplate/page', data),
    getTplList: (data) => instance.post('/devopsapi/configtemplate/list', data),
    createTpl: (data) =>
      instance.post('/devopsapi/configtemplate/insert', data),
    deleteTpl: (data) =>
      instance.post('/devopsapi/configtemplate/delete', data),
    updateTpl: (data) =>
      instance.post('/devopsapi/configtemplate/update', data),
    // 查找引用此模板的应用
    findReference: (data) =>
      instance.post('/devopsapi/configtemplate/findReference', data),
  }
}
