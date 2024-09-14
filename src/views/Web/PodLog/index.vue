<template>
  <Teleport to="body" :disabled="fullScreen === false">
    <!-- 正文 -->
    <div class="page-main br-6 overflow-hidden p-log" :style="pagePositonStyle">
      <Toolbar
        theme="black"
        :podName="podName"
        :connectStatus="status"
        :defaultAutoScroll="autoScroll"
        :defaultFullScreen="fullScreen"
        :defaultLineFeed="lineFeed"
        :defaultTailLine="tailLine"
        @trigger="triggerToolbar"
      ></Toolbar>

      <div class="flex-v-1" :style="rowStyle">
        <el-scrollbar height="100%" ref="scrollbarRef">
          <div class="px-20 font-14">
            <div
              class="u-row"
              v-for="(logStr, index) in podLog"
              :key="index"
              v-html="logStr"
            ></div>
          </div>
        </el-scrollbar>
      </div>
      <div class="p-20">
        <el-input
          placeholder="输入日志，按回车键提交"
          v-model="inputLog"
          @keyup.enter="enterLog"
        ></el-input>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Toolbar from './toolbar.vue'
import useInit from './useInit'

const {
  query: { podName, branchId, appId },
} = useRoute()

const scrollbarRef = ref()

const {
  status,
  podLog,
  inputLog,
  enterLog,
  autoScroll,
  lineFeed,
  fullScreen,
  tailLine,
  triggerToolbar,
} = useInit({
  podName,
  branchId,
  appId,
  scrollbarRef,
})

const pagePositonStyle = computed(() => {
  return fullScreen.value
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        width: '100%',
        height: '100%',
        borderRadius: 0,
      }
    : null
})

const rowStyle = computed(() => {
  return {
    whiteSpace: lineFeed.value ? 'pre-wrap' : 'pre',
  }
})
</script>

<style lang="stylus" scoped>
.page-main
  display flex
  flex-direction column
  height calc(100vh - 60px)
.p-log
  color #bababa
  background-color #1e1e1e
  .u-row
    margin 8px 0
  :deep(.u-error)
    margin 8px 0
    font-weight bold
    color var(--el-color-danger)
</style>
