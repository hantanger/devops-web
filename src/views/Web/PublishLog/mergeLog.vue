<template>
  <div v-show="visible">
    <div class="mb-10">分支合并记录</div>
    <el-table border stripe :data="data">
      <el-table-column
        label="Git Branch"
        prop="gitBranch"
        width="200px"
      ></el-table-column>
      <el-table-column label="Commit ID" prop="commitId"></el-table-column>
      <el-table-column label="Commit Message" prop="message"></el-table-column>
      <el-table-column label="Commit Time" prop="committedDate" width="200px">
        <template #default="{ row }">
          <FriendlyTime :time="row.committedDate"></FriendlyTime>
        </template>
      </el-table-column>
      <el-table-column label="Committer" prop="committerName" width="150px">
        <template #default="{ row }">
          <PersonNames :names="row.committerName"></PersonNames>
        </template>
      </el-table-column>
    </el-table>
    <el-divider />
  </div>
</template>

<script setup>
import PersonNames from '@/components/PersonNames.vue'
import FriendlyTime from '@/components/FriendlyTime.vue'

defineProps({
  visible: [Boolean, Number],
  data: Array,
})
</script>
