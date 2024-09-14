<template>
  <!-- 搜索 -->
  <el-form
    class="p-20 bg-white br-6"
    label-position="top"
    :model="formData"
    @submit.prevent
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="环境名称">
          <el-input
            clearable
            v-model="formData.name"
            @keyup.enter="search"
          ></el-input>
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
      <el-button type="primary" @click="clickCreate">创建环境</el-button>
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
      <el-table-column prop="name" label="环境名称" min-width="120px">
        <template #default="{ row }">
          <router-link :to="{ name: 'envDetail', query: { envId: row.id } }">
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="harborProject"
        label="Harbor Project"
        min-width="120px"
      ></el-table-column>
      <el-table-column
        prop="jenkinsUrl"
        label="Jenkins Url"
        min-width="150px"
      ></el-table-column>
      <el-table-column
        prop="jenkinsNode"
        label="Jenkins Node"
        min-width="150px"
      ></el-table-column>
      <el-table-column
        prop="k8sNamespace"
        label="K8s Namespace"
        min-width="120px"
      ></el-table-column>
      <el-table-column
        prop="suffix"
        label="后缀"
        min-width="120px"
      ></el-table-column>
      <el-table-column prop="updatedBy" label="更新人" width="100px">
        <template #default="{ row }">
          <PersonNames :names="row.updatedBy"></PersonNames>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedTime"
        label="更新时间"
        width="150px"
      ></el-table-column>
      <el-table-column label="操作" min-width="150px" fixed="right">
        <template #default="{ row }">
          <!-- 编辑 -->
          <el-button plain type="primary" @click="clickEdit(row)">
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
              <el-button plain :loading="row.delLoading">删除</el-button>
            </template>
          </el-popconfirm>
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
import { useDateFormat } from '@vueuse/core'
import useSearchTable from '@/hooks/useSearchTable'
import ajaxStore from '@/ajaxStore'
import PersonNames from '@/components/PersonNames.vue'
import DialogCreate from './dialogCreate/index.vue'

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
  defaultFormData: {
    name: '',
  },
  requestApi: ajaxStore.envManage.getPagedEnv,
  transformResponse(res) {
    res?.data?.pagedRecords?.length &&
      res.data.pagedRecords.forEach((item) => {
        item.updatedTime = useDateFormat(item.updatedTime, 'YYYY-MM-DD HH:mm')
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
function clickEdit({
  id,
  name,
  commonData,
  harborProject,
  jenkinsUrl,
  jenkinsToken,
  jenkinsNode,
  k8sNamespace,
  k8sApiserver,
  k8sToken,
  suffix,
  isSupportFeatureEnv,
  orderBy,
  remark,
}) {
  dialogState.mode = 'edit'
  dialogState.id = id
  dialogState.editData = {
    name,
    commonData,
    harborProject,
    jenkinsUrl,
    jenkinsToken,
    jenkinsNode,
    k8sNamespace,
    k8sApiserver,
    k8sToken,
    suffix,
    isSupportFeatureEnv,
    orderBy,
    remark,
  }
  dialogState.visible = true
}

// 确认删除
async function confirmDelete(row) {
  row.delLoading = true
  const res = await ajaxStore.envManage.deleteEnv({ envConfigId: row.id })
  row.delLoading = false
  if (res?.data?.code === '0') {
    ElMessage.success('删除成功')
    getTableList()
  }
}
</script>
