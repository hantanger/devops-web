import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ajaxStore from '@/ajaxStore'
import { useUserStore } from '@/store/user'
import { useServerCacheStore } from '@/store/serverCache'

export default function ({ formRef }) {
  const router = useRouter()
  const {
    query: { redirect },
  } = useRoute()
  const userStore = useUserStore()
  const serverCacheStore = useServerCacheStore()

  const submitLoading = ref(false)

  const formData = ref({
    username: '',
    password: '',
  })

  const formRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }

  function clickSubmit() {
    formRef.value.validate(async (v) => {
      if (!v) return

      submitLoading.value = true
      const res = await ajaxStore.common.login({
        username: formData.value.username,
        password: formData.value.password,
      })
      submitLoading.value = false
      if (res?.data?.code === '0' && res?.data?.data) {
        const data = res.data.data
        // 更新全局用户数据
        userStore.setData({
          username: data?.username ?? '',
          token: data?.token ?? '',
          role: data?.role ?? '',
        })
        // 加载服务端配置类数据
        serverCacheStore.getAppOwnerList()
        // eslint-disable-next-line
        // 跳转到对应页面
        if (redirect) {
          router.push(redirect)
        } else {
          router.push({
            name: 'appManage',
          })
        }
      }
    })
  }

  return {
    formData,
    formRules,
    submitLoading,
    clickSubmit,
  }
}
