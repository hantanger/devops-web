export default function (instance) {
  return {
    // 新增收藏应用
    collect: (data) => instance.post('/devopsapi/userAppFavorite/insert', data),
    // 取消收藏
    removeCollect: (data) =>
      instance.post('/devopsapi/userAppFavorite/delete', data),
    // 收藏列表
    getPagedCollect: (data) =>
      instance.post('/devopsapi/userAppFavorite/page', data),
  }
}
