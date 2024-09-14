<template>
  <el-form
    class="p-20 bg-white br-6"
    label-position="top"
    :model="formData"
    @submit.prevent
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="环境分支名称">
          <el-input
            clearable
            v-model="formData.routingMark"
            @change="search"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="环境分支创建人">
          <el-select
            class="w-full"
            clearable
            filterable
            placeholder=" "
            :loading="appOwnerLoading"
            v-model="formData.createdBy"
            @change="search"
          >
            <el-option
              v-for="item in appOwnerList"
              :key="item.uid"
              :label="item.username"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="应用名称">
          <el-select
            class="w-full"
            clearable
            filterable
            placeholder=" "
            :loading="appListLoading"
            v-model="formData.appId"
            @change="search"
          >
            <el-option
              v-for="item in appList"
              :key="item.uid"
              :label="item.label"
              :value="item.key"
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
    <div>
      <el-button type="primary" @click="dialogBatchCreateVisible = true">
        批量创建环境分支
      </el-button>
    </div>

    <el-table
      class="mt-20"
      border
      stripe
      empty-text="暂无数据"
      :data="tableList"
      v-loading="loading"
    >
      <el-table-column prop="routingMark" label="环境分支"></el-table-column>
      <el-table-column
        prop="gitBranch"
        label="Git 分支"
        min-width="120px"
      ></el-table-column>
      <el-table-column prop="name" label="应用名称">
        <template #default="{ row }">
          <div class="flex items-center">
            <router-link
              class="mr-5"
              :to="{ name: 'appDetail', query: { appId: row.appId } }"
            >
              {{ row.appName }}
            </router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="appType" label="应用类型">
        <template #default="{ row }">
          <el-tag>{{ row.appType || '- -' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" label="环境分支创建人">
        <template #default="{ row }">
          <PersonNames :names="row.createdBy"></PersonNames>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间">
        <template #default="{ row }">
          <FriendlyTime :time="row.createdTime"></FriendlyTime>
        </template>
      </el-table-column>
      <el-table-column prop="expireTime" label="过期时间">
        <template #default="{ row }">
          <CellExpireTime :expireTime="row.expireTime"></CellExpireTime>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px" fixed="right">
        <template #default="{ row }">
          <!-- 删除 -->
          <el-popconfirm
            title="是否确认删除？"
            confirm-button-text="是"
            cancel-button-text="否"
            @confirm="confirmDelete(row)"
          >
            <template #reference>
              <el-button plain>删除</el-button>
            </template>
          </el-popconfirm>
          <el-button @click="clickRenew(row)">续期</el-button>
        </template>
      </el-table-column>
    </el-table>

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

  <BatchCreateBranchDialog
    :visible="dialogBatchCreateVisible"
    :testaEnvId="testaEnvId"
    @close="dialogBatchCreateVisible = false"
    @success="batchCreateSuccess"
  ></BatchCreateBranchDialog>

  <DialogRenew
    :visible="dialogRenew.visible"
    :id="dialogRenew.id"
    @close="dialogRenew.visible = false"
    @success="renewSuccess"
  ></DialogRenew>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'
import useSearchTable from '@/hooks/useSearchTable'
import FriendlyTime from '@/components/FriendlyTime.vue'
import PersonNames from '@/components/PersonNames.vue'
import ajaxStore from '@/ajaxStore'
import { useServerCacheStore } from '@/store/serverCache'
import BatchCreateBranchDialog from './batchCreateBranchDialog.vue'
import DialogRenew from './dialogRenew.vue'
import CellExpireTime from './cellExpireTime.vue'
import useInit from './useInit'

const serverCacheStore = useServerCacheStore()
const { appOwnerList, appOwnerLoading } = storeToRefs(serverCacheStore)
serverCacheStore.getAppOwnerList()

const {
  loading,
  formData,
  tableList,
  pageNo,
  totalCount,
  getTableList,
  search,
  reset,
  changePage,
} = useSearchTable({
  defaultFormData: { routingMark: '', appId: '', createdBy: '', envId: '' },
  requestApi: ajaxStore.branchManage.getPagedBranch,
  transformResponse(res) {
    res?.data?.pagedRecords?.length &&
      res.data.pagedRecords.forEach((item) => {
        item.updatedTime = useDateFormat(item.updatedTime, 'YYYY-MM-DD HH:mm')
        item.delLoading = false
      })
    return res
  },
  init: false,
})

const { testaEnvId, appList, appListLoading } = useInit({
  formData,
  getTableList,
})

const dialogBatchCreateVisible = ref(false)
const dialogRenew = ref({
  visible: false,
  id: null,
})

function batchCreateSuccess() {
  dialogBatchCreateVisible.value = false
  getTableList()
}

async function confirmDelete(row) {
  row.delLoading = true
  const res = await ajaxStore.branchManage.batchDeleteBranch({ data: [row.id] })
  row.delLoading = false
  if (res?.data?.code === '0') {
    ElMessage.success('删除成功')
    getTableList()
  }
}

function clickRenew(row) {
  dialogRenew.value.id = row.id
  dialogRenew.value.visible = true
}

function renewSuccess() {
  dialogRenew.value.visible = false
  getTableList()
}
</script>
