<template>
  <!-- 搜索 -->
  <el-form
    class="p-20 bg-white br-6"
    label-position="top"
    :model="formData"
    v-loading="initLoading"
    @submit.prevent
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="应用名称">
          <el-select
            class="w-full"
            placeholder=" "
            clearable
            filterable
            v-model="formData.appId"
            @change="changeApp"
          >
            <el-option
              v-for="item in appOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span>{{ item.label }}</span>
              <span class="ml-5 float-right color-text-secondary">
                {{ appType[item.appType] }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="环境名称">
          <el-select
            class="w-full"
            placeholder=" "
            clearable
            filterable
            v-model="formData.envId"
            @change="changeEnv"
          >
            <el-option
              v-for="item in envOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="环境分支">
          <el-select
            class="w-full"
            placeholder=" "
            clearable
            filterable
            :disabled="!(formData.appId && formData.envId)"
            v-model="formData.appDeployId"
            @change="changeAppDeploy"
          >
            <el-option
              v-for="item in branchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发布状态">
          <el-select
            class="w-full"
            placeholder=" "
            clearable
            v-model="formData.status"
            @change="search"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="发布日期">
          <el-date-picker
            clearable
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="formData.date"
            @change="search"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发布单">
          <el-select
            class="w-full"
            placeholder=" "
            clearable
            filterable
            v-model="formData.appPublishOrderId"
            @change="search"
          >
            <el-option
              v-for="item in publishOrderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-button type="primary" :loading="loading" @click="search">
          搜索
        </el-button>
        <el-button :loading="loading" @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </el-form>

  <div class="mt-10 p-20 bg-white br-6">
    <div v-if="hasRole('0')">
      <el-button type="primary" @click="clickBatchPublish">
        创建发布单
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      class="mt-20"
      border
      stripe
      empty-text="暂无数据"
      :data="tableList"
      v-loading="loading"
    >
      <el-table-column prop="id" label="发布编号" min-width="100px">
        <template #default="{ row }">
          <router-link
            :to="{ name: 'publishLog', query: { publishId: row.id } }"
          >
            {{ row.id }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="appName" label="应用名称" min-width="140px">
        <template #default="{ row }">
          <router-link :to="{ name: 'appDetail', query: { appId: row.appId } }">
            {{ row.appName || '- -' }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="appType" label="应用类型" min-width="90px">
        <template #default="{ row }">
          <el-tag size="small">{{ row.appType || '- -' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="envName"
        label="环境名称"
        min-width="100px"
      ></el-table-column>
      <el-table-column
        prop="routingMark"
        label="环境分支"
        min-width="100px"
      ></el-table-column>
      <el-table-column
        prop="autoMergeGitBranchName"
        label="自动合并分支"
        min-width="220px"
      ></el-table-column>
      <el-table-column prop="createdBy" label="发布人" min-width="100px">
        <template #default="{ row }">
          <PersonNames :names="row.createdBy"></PersonNames>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="发布状态" min-width="100px">
        <template #default="{ row }">
          <PublishStatusLink :status="row.status"></PublishStatusLink>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="发布时间" min-width="100px">
        <template #default="{ row }">
          <FriendlyTime :time="row.createdTime"></FriendlyTime>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200px" fixed="right">
        <template #default="{ row }">
          <!-- 查看配置 -->
          <el-button plain @click="clickConfigInfo(row)">查看配置</el-button>
          <!-- 回滚 -->
          <ConfirmBtn
            v-if="hasRole('0') && row.status === 1"
            btnType="warning"
            btnText="回滚"
            confirmTitle="是否确认回滚？"
            successText="回滚成功"
            :requestApi="ajaxStore.publishManage.rollback"
            :params="{ data: row.id }"
            @success="search"
          ></ConfirmBtn>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex justify-center mt-20">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageNo"
        :total="totalCount"
        :disabled="loading"
        @current-change="changePage"
      />
    </div>
  </div>

  <ConfigInfoDialog
    :visible="dialogConfig.visible"
    :dockerfile="dialogConfig.dockerfile"
    :yaml="dialogConfig.yaml"
    @close="dialogConfig.visible = false"
  ></ConfigInfoDialog>

  <BatchPublishDialog
    :visible="dialogBatch.visible"
    :envOptions="envOptions"
    @close="dialogBatch.visible = false"
    @success="batchPublishSuccess"
  ></BatchPublishDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import useSearchTable from '@/hooks/useSearchTable'
import ajaxStore from '@/ajaxStore'
import ConfigInfoDialog from '@/components/ConfigInfoDialog.vue'
import PublishStatusLink from '@/components/PublishStatusLink.vue'
import ConfirmBtn from '@/components/ConfirmBtn.vue'
import PersonNames from '@/components/PersonNames.vue'
import FriendlyTime from '@/components/FriendlyTime.vue'
import BatchPublishDialog from './batchPublishDialog.vue'
import useOptions from './useOptions'
import { appType } from '@/const/enum'

// option加载完成的状态
const optionsLoadedStatus = ref(false)

const {
  loading,
  formData,
  tableList,
  pageNo,
  totalCount,
  search,
  reset,
  changePage,
} = useSearchTable({
  optionsLoadedStatus,
  defaultFormData: {
    appId: '',
    envId: '',
    appDeployId: '',
    appPublishOrderId: '',
    status: '',
    date: [],
  },
  requestApi: ajaxStore.publishManage.getPagedPublish,
  transformParams(params) {
    params.status && (params.status = Number(params.status))
    if (params?.date?.length) {
      params.queryParamStartDate = params.date[0]
      params.queryParamEndDate = params.date[1]
    }
    delete params.date
    return params
  },
  transformResponse(res) {
    res?.data?.pagedRecords?.length &&
      res.data.pagedRecords.forEach((item) => {
        item.createdTime = useDateFormat(item.createdTime, 'YYYY-MM-DD HH:mm')
      })
    return res
  },
})

const {
  initLoading,
  appOptions,
  envOptions,
  branchOptions,
  statusOptions,
  publishOrderOptions,
} = useOptions({
  formData,
  optionsLoaded: () => (optionsLoadedStatus.value = true),
})

// 查看配置 dialog
const dialogConfig = reactive({
  visible: false,
  dockerfile: '',
  yaml: '',
})

// 批量发布 dialog
const dialogBatch = reactive({
  visible: false,
})

// 点击查看配置
function clickConfigInfo(row) {
  dialogConfig.visible = true
  dialogConfig.dockerfile = row.dockerfile
  dialogConfig.yaml = row.yaml
}

function changeApp() {
  formData.value.envId = ''
  formData.value.appDeployId = ''
  search()
}
function changeEnv() {
  formData.value.appDeployId = ''
  search()
}
function changeAppDeploy() {
  search()
}

// 点击批量发布
function clickBatchPublish() {
  dialogBatch.visible = true
}

// 批量发布成功
function batchPublishSuccess() {
  dialogBatch.visible = false
  setTimeout(() => {
    search()
  }, 1000)
}
</script>
