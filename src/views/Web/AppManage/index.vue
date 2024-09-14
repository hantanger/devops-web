<template>
  <el-form
    class="p-20 bg-white br-6"
    label-position="top"
    :model="formData"
    @submit.prevent
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="应用名称">
          <el-input
            clearable
            v-model="formData.name"
            @change="search"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="应用类型">
          <el-select
            class="w-full"
            placeholder=" "
            clearable
            v-model="formData.appType"
            @change="search"
          >
            <el-option
              v-for="item in appTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="应用负责人">
          <el-select
            class="w-full"
            clearable
            filterable
            placeholder=" "
            :loading="appOwnerLoading"
            v-model="formData.appOwner"
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
      <el-button type="primary" @click="clickCreate">创建应用</el-button>
    </div>

    <el-table
      class="mt-20"
      border
      stripe
      empty-text="暂无数据"
      :data="tableList"
      v-loading="loading"
    >
      <el-table-column prop="name" label="应用名称">
        <template #default="{ row }">
          <div class="flex items-center">
            <router-link
              class="mr-5"
              :to="{ name: 'appDetail', query: { appId: row.id } }"
            >
              {{ row.name }}
            </router-link>
            <CollectBtn
              :appId="row.id"
              :checked="row.userAppFavorite"
              @success="row.userAppFavorite = !row.userAppFavorite"
            ></CollectBtn>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="appType" label="应用类型">
        <template #default="{ row }">
          <el-tag>{{ appType[row.appType] || '- -' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="appOwner" label="应用负责人">
        <template #default="{ row }">
          <PersonNames :names="row.appOwner"></PersonNames>
        </template>
      </el-table-column>
      <el-table-column prop="updatedTime" label="更新时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" v-if="hasRole('0')">
        <template #default="{ row }">
          <!-- 编辑 -->
          <el-button
            plain
            type="primary"
            :disabled="!row.hasPermission"
            @click="clickEdit(row)"
          >
            编辑
          </el-button>
          <!-- 删除 -->
          <el-popconfirm
            title="是否确认删除？"
            confirm-button-text="是"
            cancel-button-text="否"
            @confirm="confirmDelete(row)"
          >
            <template #reference>
              <el-button
                plain
                :disabled="!row.hasPermission"
                :loading="row.delLoading"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
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

  <DialogCreate
    :visible="dialogState.visible"
    :mode="dialogState.mode"
    :id="dialogState.id"
    :edit-data="dialogState.editData"
    @success="submitSuccess"
    @close="dialogState.visible = false"
  ></DialogCreate>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'
import useSearchTable from '@/hooks/useSearchTable'
import CollectBtn from '@/components/CollectBtn.vue'
import PersonNames from '@/components/PersonNames.vue'
import ajaxStore from '@/ajaxStore'
import { appType } from '@/const/enum'
import { objectToOptions } from '@/utils/util'
import DialogCreate from './dialogCreate/index.vue'
import { useServerCacheStore } from '@/store/serverCache'

const appTypeOptions = objectToOptions(appType)

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
  defaultFormData: { name: '', appType: '', appOwner: '' },
  requestApi: ajaxStore.appManage.getPagedApp,
  transformResponse(res) {
    res?.data?.pagedRecords?.length &&
      res.data.pagedRecords.forEach((item) => {
        item.updatedTime = useDateFormat(item.updatedTime, 'YYYY-MM-DD HH:mm')
        item.delLoading = false
      })
    return res
  },
})

const dialogState = reactive({
  visible: false,
  mode: 'create', // create 或 edit
  id: 0,
  editData: {},
})

// 提交成功，创建或编辑
function submitSuccess() {
  dialogState.visible = false
  getTableList()
}

// 点击创建
function clickCreate() {
  dialogState.mode = 'create'
  dialogState.visible = true
}
// 点击编辑
function clickEdit(row) {
  dialogState.mode = 'edit'
  dialogState.id = row.id
  dialogState.editData = {
    name: row.name,
    appType: row.appType,
    gitProjectUrl: row.gitProjectUrl,
    appOwner: row.appOwner.split(','),
    remark: row.remark,
  }
  dialogState.visible = true
}

// 确认删除
async function confirmDelete(row) {
  row.delLoading = true
  const res = await ajaxStore.appManage.deleteApp({ appId: row.id })
  row.delLoading = false
  if (res?.data?.code === '0') {
    ElMessage.success('删除成功')
    getTableList()
  }
}
</script>
