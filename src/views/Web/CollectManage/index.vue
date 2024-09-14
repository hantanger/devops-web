<template>
  <div class="p-20 bg-white br-6">
    <!-- 表格 -->
    <el-table
      border
      stripe
      empty-text="暂无数据"
      :data="tableList"
      v-loading="loading"
    >
      <el-table-column label="应用名称" min-width="160px">
        <template #default="{ row }">
          <router-link
            class="mr-5"
            :to="{ name: 'appDetail', query: { appId: row.id } }"
          >
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="应用类型">
        <template #default="{ row }">
          <el-tag size="small">{{ appType[row.appType] || '- -' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="appOwner" label="应用负责人">
        <template #default="{ row }">
          <PersonNames :names="row.appOwner"></PersonNames>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200px" fixed="right">
        <template #default="{ row }">
          <!-- 取消收藏 -->
          <ConfirmBtn
            btnType="primary"
            btnText="取消收藏"
            confirmTitle="是否确认取消收藏？"
            successText="取消成功"
            :requestApi="ajaxStore.collectManage.removeCollect"
            :params="{ appId: row.id }"
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
</template>

<script setup>
import useSearchTable from '@/hooks/useSearchTable'
import ConfirmBtn from '@/components/ConfirmBtn.vue'
import PersonNames from '@/components/PersonNames.vue'
import ajaxStore from '@/ajaxStore'
import { appType } from '@/const/enum'

const { loading, tableList, pageNo, totalCount, search, changePage } =
  useSearchTable({
    requestApi: ajaxStore.collectManage.getPagedCollect,
  })
</script>
