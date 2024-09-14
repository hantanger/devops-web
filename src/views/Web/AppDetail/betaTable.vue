<template>
  <el-table border stripe :data="branchList">
    <el-table-column prop="id" label="ID" width="80px">
      <template #default="{ row }">
        <router-link
          :to="{
            name: 'publishManage',
            query: { appId: row.appId, envId: row.envId, appDeployId: row.id },
          }"
        >
          {{ row.id }}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column prop="routingMark" label="环境分支" min-width="110px">
      <template #default="{ row }">
        <BranchBell :name="row.routingMark" :change="row.change" />
      </template>
    </el-table-column>
    <el-table-column
      prop="gitBranch"
      label="Git分支"
      min-width="110px"
    ></el-table-column>
    <!-- 绑定的环境分支 beta环境才有 -->
    <el-table-column prop="" label="绑定的环境分支" min-width="240px">
      <template #header>
        <div class="flex items-center">
          <span>绑定的环境分支</span>
          <el-tooltip placement="top">
            <template #content>
              <div>建议选择其中一种模式作为约定：</div>
              <div>
                1、release模式：创建一个release环境分支，beta仅绑定此环境分支；
              </div>
              <div>
                2、灵活模式：beta仅绑定特性环境分支，不要绑定release这类综合性分支；
              </div>
            </template>
            <el-icon color="#f17f42"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <template #default="{ row }">
        <el-button type="primary" link @click="clickBinding(row)">
          <el-icon><Edit /></el-icon>
          <span>编辑</span>
        </el-button>
        <template v-if="row.bindingList && row.bindingList.length">
          <div v-for="item in row.bindingList">
            <span>{{ item.routingMark }}</span>
            <span style="color: #ccc">({{ item.gitBranch }})</span>
          </div>
        </template>
        <template v-else>
          <div>暂无绑定</div>
        </template>
      </template>
    </el-table-column>
    <el-table-column
      prop="publishDetailStatus"
      label="最近发布状态"
      width="110px"
    >
      <template #default="{ row }">
        <PublishStatusLink
          :status="row.publishDetailStatus"
          :publishId="row.appPublishDetailId"
        ></PublishStatusLink>
      </template>
    </el-table-column>
    <el-table-column
      prop="appPublishUpdatedBy"
      label="最近发布人"
      width="110px"
    >
      <template #default="{ row }">
        <PersonNames :names="row.appPublishUpdatedBy"></PersonNames>
      </template>
    </el-table-column>
    <el-table-column
      prop="appPublishUpdatedTime"
      label="最近发布时间"
      width="110px"
    >
      <template #default="{ row }">
        <FriendlyTime :time="row.appPublishUpdatedTime"></FriendlyTime>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="370px" fixed="right">
      <template #default="{ row }">
        <!-- 发布 -->
        <ConfirmBtn
          btnType="primary"
          btnText="发布"
          confirmTitle="是否确认发布？"
          successText="创建发布成功"
          :requestApi="ajaxStore.publishManage.publish"
          :params="{ data: row.id }"
          :disabled="row.publishDetailStatus === 0"
          @success="(res) => emit('publishSuccess', res)"
        ></ConfirmBtn>
        <!-- 终止 -->
        <ConfirmBtn
          v-if="row.publishDetailStatus > 1"
          btnType="warning"
          btnText="终止"
          confirmTitle="是否确认终止发布？"
          successText="终止发布成功"
          :requestApi="ajaxStore.publishManage.exit"
          :params="{ data: row.appPublishDetailId }"
          @success="(res) => emit('exitSuccess', res)"
        ></ConfirmBtn>
        <div class="mt-10"></div>
        <!-- 查看Pod日志 -->
        <el-button plain @click="emit('readPodLog', row.id)">Pod日志</el-button>
        <!-- 查看配置 -->
        <el-button plain @click="emit('showConfig', row)">查看配置</el-button>
        <!-- 编辑 -->
        <el-button plain @click="emit('edit', row)" v-if="hasRole('0')">
          编辑
        </el-button>
        <!-- 删除 -->
        <ConfirmBtn
          v-if="hasRole('0')"
          btnText="删除"
          confirmTitle="是否确认删除？"
          successText="删除成功"
          :requestApi="ajaxStore.appManage.delEnvBranch"
          :params="{ appDeployId: row.id }"
          @success="emit('delSuccess')"
        ></ConfirmBtn>
      </template>
    </el-table-column>
  </el-table>

  <BindingDialog
    :visible="dialogEditBinding.visible"
    :branchId="dialogEditBinding.branchId"
    :editData="dialogEditBinding.editData"
    @close="dialogEditBinding.visible = false"
    @success="bindSuccess"
  ></BindingDialog>
</template>

<script setup>
import { toRefs, reactive, watch } from 'vue'
import ajaxStore from '@/ajaxStore'
import ConfirmBtn from '@/components/ConfirmBtn.vue'
import PublishStatusLink from '@/components/PublishStatusLink.vue'
import BranchBell from '@/components/BranchBell.vue'
import PersonNames from '@/components/PersonNames.vue'
import FriendlyTime from '@/components/FriendlyTime.vue'
import BindingDialog from './bindingDialog/index.vue'

const props = defineProps({
  branchList: Array,
  isAppAdmin: Boolean, // 是否为应用管理员
})

const { branchList } = toRefs(props)

const emit = defineEmits([
  'edit',
  'delSuccess',
  'publishSuccess',
  'exitSuccess',
  'showConfig',
  'readPodLog',
])

// 发布State
const dialogEditBinding = reactive({
  visible: false,
  branchId: null,
  editData: {},
})

// 点击编辑绑定
function clickBinding(row) {
  dialogEditBinding.visible = true
  dialogEditBinding.branchId = row.id
  dialogEditBinding.editData = {
    appDeployIds: row?.bindingList?.length
      ? row.bindingList.map((item) => item.id)
      : [],
  }
}

// 初始化现有branch的绑定分支
function initBindingList() {
  branchList.value.forEach(async (branch) => {
    const res = await ajaxStore.appManage.getBinding({ data: branch.id })
    if (res?.data?.code === '0' && res?.data?.data?.length) {
      branch.bindingList = res.data.data.filter((item) => item.checked)
    }
  })
}

// 绑定成功
function bindSuccess() {
  initBindingList()
  dialogEditBinding.visible = false
}

watch(
  () => props.branchList,
  (v) => initBindingList(),
  {
    immediate: true,
  }
)
</script>
