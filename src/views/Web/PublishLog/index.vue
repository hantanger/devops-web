<template>
  <div class="page-main">
    <!-- 描述列表 -->
    <div
      class="bg-white br-6"
      style="max-height: 200px"
      v-loading="detailLoading"
    >
      <el-scrollbar height="100%">
        <div class="m-20">
          <el-descriptions border :column="3">
            <el-descriptions-item
              label="应用名称"
              label-class-name="white-space-nowrap"
            >
              {{ detail.appName || '- -' }}
            </el-descriptions-item>
            <el-descriptions-item
              label="环境名称"
              label-class-name="white-space-nowrap"
            >
              {{ detail.envName || '- -' }}
            </el-descriptions-item>
            <el-descriptions-item
              label="环境分支"
              label-class-name="white-space-nowrap"
            >
              {{ detail.routingMark || '- -' }}
            </el-descriptions-item>
            <el-descriptions-item
              label="发布状态"
              :span="2"
              label-class-name="white-space-nowrap"
            >
              <Steps
                :processIndex="processIndex"
                :statusList="statusList"
                :processStatus="processStatus"
              ></Steps>
              <div class="color-danger" v-if="detail.failedReason">
                错误原因: {{ detail.failedReason }}
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-scrollbar>
    </div>
    <!-- 正文 -->
    <div class="bg-white br-6 mt-10 flex-v-1 flex flex-col">
      <Toolbar
        :defaultAutoScroll="autoScroll"
        @trigger="triggerToolbar"
      ></Toolbar>
      <div class="flex-v-1">
        <el-scrollbar height="100%" ref="scrollbarRef">
          <div class="p-20 color-text-regular font-14">
            <!-- 合并日志 -->
            <MergeLog
              :visible="
                detail.appDeployBranchCommitList &&
                detail.appDeployBranchCommitList.length
              "
              :data="detail.appDeployBranchCommitList"
            ></MergeLog>

            <!-- jenkins日志 -->
            <template v-for="item in logs">
              <div class="white-space-pre-wrap" v-html="item"></div>
            </template>

            <div v-if="publishLoading">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
            </div>
            <div class="mt-20" v-else-if="logs && logs.length">
              Jenkins构建结束
            </div>
            <div class="mt-20" v-else>暂无日志</div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup name="PublishLog">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import MergeLog from './mergeLog.vue'
import Steps from './steps.vue'
import Toolbar from './toolbar.vue'
import useInit from './useInit'

const {
  query: { publishId },
} = useRoute()

const scrollbarRef = ref()

const {
  detailLoading,
  publishLoading,
  detail,
  statusList,
  processIndex,
  processStatus,
  logs,
  autoScroll,
  triggerToolbar,
} = useInit({
  publishId: Number(publishId),
  scrollbarRef,
})
</script>

<style lang="stylus" scoped>
.page-main
  display flex
  flex-direction column
  height calc(100vh - 60px)
  .u-process-icon
    font-size 24px
  :deep(.u-error)
    margin 8px 0
    font-weight bold
    color var(--el-color-danger)
</style>
