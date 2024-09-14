<template>
  <span v-for="(item, index) in nameArr" :key="item">
    {{ (appOwnerMap[item] && appOwnerMap[item].username) || item }}
    <span v-show="index < nameArr.length - 1">，</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useServerCacheStore } from '@/store/serverCache'

const props = defineProps({
  names: String, // 'name1,name2'
})

const nameArr = computed(() => (props.names ? props.names.split(',') : []))

const serverCacheStore = useServerCacheStore()
const { appOwnerMap, appOwnerFetched } = storeToRefs(serverCacheStore)

appOwnerFetched.value === false && serverCacheStore.getAppOwnerList()
</script>
