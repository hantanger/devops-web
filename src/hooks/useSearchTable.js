import { ref, watch } from 'vue'
import { deepCopy } from '@/utils/util'
import { useRouter, useRoute } from 'vue-router'

export default function ({
  defaultFormData = {}, // 搜索表单的默认值
  defaultParams = {}, // 用于搜索表格的默认参数
  requestApi, // 搜索表格的接口函数
  transformParams, // 转换请求参数，返回处理后的结果
  transformResponse, // 转换请求结果，返回处理后的结果
  pageSize = 10, // 默认单页条数
  optionsLoadedStatus, // 可选，ref对象，所有option或配置加载完成的状态，初始值为false，加载完成后变为true，用于防止select显示数字
  init = true, // 是否自动发起请求
}) {
  const router = useRouter()
  const route = useRoute()

  // 第一次执行时，记录当前页面的routeName，防止routeName变更导致多余的请求
  // const initRouteName = route.name;

  // search loading
  const loading = ref(false)
  // 表格数据
  const tableList = ref([])
  // 页码
  const pageNo = ref(1)
  // 总条数
  const totalCount = ref(0)
  // 搜索表单
  const formData = ref(deepCopy(defaultFormData))
  // 路由中除筛选条件外的参数
  const otherQuery = {}
  route.query &&
    Object.keys(route.query).forEach((key) => {
      !Object.prototype.hasOwnProperty.call(defaultFormData, key) &&
        (otherQuery[key] = route.query[key])
    })

  // 根据query重置formData
  function queryToFormData() {
    Object.keys(formData.value).forEach((key) => {
      formData.value[key] = route.query[key] || defaultFormData[key]
    })
    route.query.pageNo && (pageNo.value = Number(route.query.pageNo))
  }

  // 根据搜索条件获取表格数据
  async function getTableList() {
    if (!requestApi) return

    loading.value = true
    let params = Object.assign(
      {},
      otherQuery,
      { pageSize, pageNo: pageNo.value },
      defaultParams,
      formData.value
    )
    transformParams && (params = transformParams(params))
    const res = await requestApi(params)
    loading.value = false
    if (res?.data?.code === '0') {
      // 转换表格数据的后门
      const resData = transformResponse ? transformResponse(res.data) : res.data
      tableList.value = resData?.data?.pagedRecords ?? []
      pageNo.value = resData?.data?.pageNo ?? 1
      totalCount.value = resData?.data?.totalCount ?? 0
    }
  }

  // 改变搜索条件而搜索
  function search() {
    const query = Object.assign({}, otherQuery, formData.value, { pageNo: 1 })
    router.push({ name, query })
  }

  // 重置
  function reset() {
    formData.value = deepCopy(defaultFormData)
    pageNo.value = 1
    const query = Object.assign({}, otherQuery, formData.value, {
      pageNo: pageNo.value,
    })
    router.push(query)
  }

  // 改变页码
  function changePage(v) {
    const query = Object.assign({}, otherQuery, formData.value, {
      pageNo: v,
    })
    router.push({
      name: route.name,
      query,
    })
  }

  if (!optionsLoadedStatus) {
    queryToFormData()
    init && getTableList()
  } else {
    watch(optionsLoadedStatus, (v) => {
      if (v === true) {
        queryToFormData()
        init && getTableList()
      }
    })
  }

  return {
    loading,
    formData,
    tableList,
    pageNo,
    totalCount,
    pageSize,
    getTableList,
    search,
    reset,
    changePage,
  }
}
