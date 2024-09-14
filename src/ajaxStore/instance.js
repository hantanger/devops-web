import axios from 'axios'
import { ElMessage } from 'element-plus'
import { baseUrl, defaultError, jwtKey } from '@/const/config'
import { useUserStore } from '@/store/user'
import router from '@/router'

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

const codePond = {} // 同一个code同一时间只会展示一次
const showError = (msg, code) => {
  if (!codePond[code]) {
    codePond[code] = true
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: msg ? msg.replace(/\n/g, '<br>') : defaultError, // 处理换行
      onClose() {
        codePond[code] = false
      },
    })
  }
}

// 处理response
function checkResponse(response) {
  const resText = response.request.responseText
  if (resText && /^{.*}$/.test(resText)) {
    const res = JSON.parse(resText)
    // 与后端约定，code不为“0”则显示message
    if (res?.code !== '0') {
      showError(res?.message)
    }
    // 如果当前在login页面，则不需要再重定向到login页面了
    if (['T00001', 'T00002', 'T00003'].indexOf(res?.code) >= 0) {
      !window.location.pathname.endsWith('login') &&
        router.push({
          name: 'login',
          query: {
            redirect: window.location.pathname + window.location.search,
          },
        })
    }
  }
}

instance.interceptors.request.use(
  (config) => {
    // 加入token
    const userStore = useUserStore()
    config.headers[jwtKey] = userStore.token
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (res) => {
    // 处理reponse
    checkResponse(res)
    return res
  },
  (err) => {
    console.error(err)
    showError(defaultError)
    // 默认是return Promise.reject(error)，此处改动可防止页面因接口错误而中断
    return {}
  }
)

export default instance
