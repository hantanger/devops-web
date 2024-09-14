import qs from 'qs'
import { basePath } from '@/const/config'

// 拼装需要跳转的路径，结果一般为 https://middle.qjdchina.com/[url]
export function getUrl(url, query) {
  let str = `${window.location.origin}${basePath}${url}`
  query && (str += `?${qs.stringify(query)}`)
  return str
}

// 将对象格式的枚举数据转换为select options数组格式
export function objectToOptions(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') return []
  return Object.keys(obj).map((key) => ({
    label: obj[key],
    value: key,
  }))
}

// 将select options数组格式转换为对象格式的枚举数据
export function optionsToObject(arr) {
  if (!Array.isArray(arr)) return {}
  const res = {}
  arr.forEach((item) => (res[item.value] = item.label))
  return res
}

// 深度拷贝
export function deepCopy(obj) {
  if (obj === null || obj === undefined) {
    return obj
  } else if (typeof obj === 'object') {
    const result = Array.isArray(obj) ? [] : {}
    for (const i in obj) {
      result[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i]
    }
    return result
  } else {
    return obj
  }
}
