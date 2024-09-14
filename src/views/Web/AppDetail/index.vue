<template>
  <div class="p-20 bg-white br-6" v-loading="detailLoading">
    <AppInfo :app-detail="appDetail"></AppInfo>
  </div>

  <div class="p-20 bg-white br-6 mt-10" v-loading="detailLoading || envLoading">
    <div class="mb-20" v-if="appDetail.hasPermission">
      <el-button type="primary" @click="clickBindEnv">创建部署环境</el-button>
      <el-button type="primary" plain @click="clickFaseBindEnv">
        一键创建部署环境
      </el-button>
    </div>

    <div class="relative">
      <el-button
        class="p-refresh"
        type="primary"
        icon="refresh"
        circle
        @click="refreshEnvBranch"
      ></el-button>
      <el-tabs v-if="envList && envList.length" v-model="activeTab">
        <el-tab-pane
          v-for="item in envList"
          :key="item.envId"
          :label="item.envName"
          :name="item.envId"
        >
          <!-- test环境，但未必只是为开发测试阶段使用-->
          <template v-if="!/^(online|beta)/.test(item.envName)">
            <TestTableWithRoute
              v-if="item.isSupportFeatureEnv === 1"
              :branchList="item.appDeployResultList"
              @createBranch="clickCreateBranch"
              @edit="clickEditBranch"
              @readPodLog="readPodLog"
              @delSuccess="refreshEnvBranch"
              @publishSuccess="publishSuccess"
              @exitSuccess="refreshEnvBranch"
              @showConfig="(row) => show(row.id)"
            ></TestTableWithRoute>
            <TestTableNoRoute
              v-else
              :branchList="item.appDeployResultList"
              @edit="clickEditBranch"
              @readPodLog="readPodLog"
              @delSuccess="refreshEnvBranch"
              @publishSuccess="publishSuccess"
              @exitSuccess="refreshEnvBranch"
              @showConfig="(row) => show(row.id)"
            ></TestTableNoRoute>
          </template>
          <!-- beta环境 -->
          <BetaTable
            v-else-if="item.envName.indexOf('beta') >= 0"
            :branchList="item.appDeployResultList"
            @edit="clickEditBranch"
            @readPodLog="readPodLog"
            @delSuccess="refreshEnvBranch"
            @publishSuccess="publishSuccess"
            @exitSuccess="refreshEnvBranch"
            @showConfig="(row) => show(row.id)"
          ></BetaTable>
          <!-- online环境 -->
          <OnlineTable
            v-else-if="item.envName.indexOf('online') >= 0"
            :branchList="item.appDeployResultList"
            :isAppAdmin="appDetail.hasPermission"
            @edit="clickEditBranch"
            @readPodLog="readPodLog"
            @delSuccess="refreshEnvBranch"
            @publishSuccess="publishSuccess"
            @exitSuccess="refreshEnvBranch"
            @showConfig="(row) => show(row.id)"
          ></OnlineTable>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <EnvDialog
    :visible="dialogEnv.visible"
    :mode="dialogEnv.mode"
    :appId="appId"
    :branchId="dialogEnv.branchId"
    :bindedEnvList="bindedEnvList"
    @close="dialogEnv.visible = false"
    @success="envSuccess"
  ></EnvDialog>

  <FastEnvDialog
    :visible="dialogFastEnv.visible"
    :appId="appId"
    :appType="appDetail.appType"
    :bindedEnvList="bindedEnvList"
    @close="dialogFastEnv.visible = false"
    @success="fastEnvSuccess"
  ></FastEnvDialog>

  <BranchDialog
    :visible="dialogBranch.visible"
    :appId="appId"
    :envId="activeTab"
    @close="dialogBranch.visible = false"
    @success="branchSuccess"
  ></BranchDialog>

  <ConfigInfoDialog
    :visible="dialogConfig.visible"
    :dockerfile="dialogConfig.dockerfile"
    :yaml="dialogConfig.yaml"
    :loading="loading"
    @close="hide"
  ></ConfigInfoDialog>

  <PodDialog
    :visible="dialogPodLog.visible"
    :branchId="dialogPodLog.branchId"
    :appId="appId"
    @close="dialogPodLog.visible = false"
  ></PodDialog>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppInfo from './appInfo.vue'
import EnvDialog from './envDialog/index.vue'
import FastEnvDialog from './fastEnvDialog/index.vue'
import BranchDialog from './branchDialog/index.vue'
import PodDialog from './podDialog/index.vue'
import TestTableNoRoute from './testTableNoRoute.vue'
import TestTableWithRoute from './testTableWithRoute.vue'
import BetaTable from './betaTable.vue'
import OnlineTable from './onlineTable.vue'
import ConfigInfoDialog from '@/components/ConfigInfoDialog.vue'
import useInit from './useInit'
import useConfigDialog from './useConfigDialog'
import { getUrl } from '@/utils/util'

const {
  query: { appId },
} = useRoute()

const {
  appDetail,
  activeTab,
  envList,
  detailLoading,
  envLoading,
  refreshEnvBranch,
} = useInit({
  appId,
})

const { state: dialogConfig, loading, show, hide } = useConfigDialog()

// 已绑定的环境
const bindedEnvList = computed(() =>
  envList?.value?.length ? envList.value.map((item) => item.envId) : []
)

// 创建部署环境State
const dialogEnv = reactive({
  visible: false,
  mode: 'create',
  branchId: null,
})
// 一键创建部署环境State
const dialogFastEnv = reactive({
  visible: false,
  branchId: null,
})

// 创建环境分支State
const dialogBranch = reactive({
  visible: false,
  envId: null,
})
// 发布日志State
const dialogPodLog = reactive({
  visible: false,
  branchId: null,
})

// 点击创建部署环境
function clickBindEnv() {
  dialogEnv.visible = true
  dialogEnv.mode = 'create'
  // refreshEnvBranch();
}

// 点击一键创建部署环境
function clickFaseBindEnv() {
  dialogFastEnv.visible = true
}

// 点击编辑环境分支
function clickEditBranch({ id }) {
  dialogEnv.mode = 'edit'
  dialogEnv.branchId = id
  dialogEnv.visible = true
  refreshEnvBranch()
}

// 绑定环境提交成功，或编辑环境分支成功
function envSuccess() {
  dialogEnv.visible = false
  refreshEnvBranch()
}
// 一键绑定环境提交成功
function fastEnvSuccess() {
  dialogFastEnv.visible = false
  refreshEnvBranch()
}

// 点击创建环境分支
function clickCreateBranch() {
  dialogBranch.visible = true
}

// 创建环境分支成功
function branchSuccess() {
  dialogBranch.visible = false
  refreshEnvBranch()
}

// 发布成功
function publishSuccess(res) {
  const data = res?.data?.data
  if (data >= 0) {
    window.open(
      getUrl('publishLog', {
        publishId: data,
      })
    )
  }
}

// 点击查看日志
function readPodLog(branchId) {
  dialogPodLog.visible = true
  dialogPodLog.branchId = branchId
}
</script>

<style lang="stylus" scoped>
.p-refresh
  position absolute
  right 0
  z-index 1
</style>
