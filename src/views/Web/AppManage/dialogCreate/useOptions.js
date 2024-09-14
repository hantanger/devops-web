import { storeToRefs } from 'pinia'
import { appType } from '@/const/enum'
import { objectToOptions } from '@/utils/util'
import { useServerCacheStore } from '@/store/serverCache'

export default function () {
  const serverCacheStore = useServerCacheStore()
  const { appOwnerList } = storeToRefs(serverCacheStore)

  return {
    appTypeOptions: objectToOptions(appType), // 应用类型options
    appOwnerOptions: appOwnerList, // 应用负责人options
  }
}
