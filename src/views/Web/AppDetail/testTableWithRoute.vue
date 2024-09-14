<template>
  <div>
    <div class="mb-20">
      <el-button type="primary" @click="emit('createBranch')">
        创建环境分支
      </el-button>
    </div>
    <el-table border stripe :data="branchList">
      <el-table-column prop="id" label="ID" width="80px">
        <template #default="{ row }">
          <router-link
            :to="{
              name: 'publishManage',
              query: {
                appId: row.appId,
                envId: row.envId,
                appDeployId: row.id,
              },
            }"
          >
            {{ row.id }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="routingMark" label="环境分支" min-width="150px">
        <template #default="{ row }">
          <BranchBell :name="row.routingMark" :change="row.change" />
        </template>
      </el-table-column>
      <el-table-column
        prop="gitBranch"
        label="Git分支"
        min-width="150px"
      ></el-table-column>
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
      <el-table-column prop="createdBy" label="创建人" width="150px">
        <template #default="{ row }">
          <PersonNames :names="row.createdBy"></PersonNames>
          <FriendlyTime :time="row.createdTime"></FriendlyTime>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="380px">
        <template #default="{ row }">
          <!-- 发布合并分支 -->
          <!-- <ConfirmBtn
            btnType="primary"
            btnText="发布合并分支"
            confirmTitle="是否合并master后发布合并分支？"
            successText="创建发布成功"
            :requestApi="ajaxStore.publishManage.publish"
            :params="{ data: row.id }"
            :disabled="row.publishDetailStatus > 1"
            @success="(res) => emit('publishSuccess', res)"
          ></ConfirmBtn> -->
          <!-- 发布自身分支 -->
          <ConfirmBtn
            btnType="primary"
            btnText="发布"
            confirmTitle="是否确认发布？"
            successText="创建发布成功"
            :requestApi="ajaxStore.publishManage.emergencyPublishTesta"
            :params="{ data: row.id }"
            :disabled="row.publishDetailStatus > 1"
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
          <el-button plain @click="emit('readPodLog', row.id)">
            Pod日志
          </el-button>
          <!-- 查看配置 -->
          <el-button plain @click="emit('showConfig', row)">查看配置</el-button>
          <!-- 编辑 -->
          <el-button plain @click="emit('edit', row)" v-if="hasRole('0')">
            编辑
          </el-button>
          <!-- 删除 -->
          <ConfirmBtn
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
  </div>
</template>

<script setup>
import ajaxStore from '@/ajaxStore'
import ConfirmBtn from '@/components/ConfirmBtn.vue'
import PublishStatusLink from '@/components/PublishStatusLink.vue'
import BranchBell from '@/components/BranchBell.vue'
import PersonNames from '@/components/PersonNames.vue'
import FriendlyTime from '@/components/FriendlyTime.vue'

defineProps({
  branchList: Array,
})

const emit = defineEmits([
  'showConfig',
  'edit',
  'readPodLog',
  'delSuccess',
  'publishSuccess',
  'exitSuccess',
  'createBranch',
])
</script>
