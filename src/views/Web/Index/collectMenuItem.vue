<template>
  <el-popover
    placement="bottom-end"
    width="200px"
    :offset="0"
    trigger="hover"
    effect="dark"
    :show-arrow="false"
  >
    <template #reference>
      <span>
        <el-icon><StarFilled /></el-icon>
        <span>我的收藏</span>
      </span>
    </template>
    <div v-if="collectStore.list && collectStore.list.length">
      <div
        class="p-row flex justify-between"
        v-for="(item, index) in collectStore.list"
        :key="item.id"
      >
        <router-link :to="{ name: 'appDetail', query: { appId: item.id } }">
          {{ item.name }}
        </router-link>
        <CollectBtn
          :appId="item.id"
          :checked="true"
          :tooltipDisabled="true"
          @success="removeSuccess(index)"
        ></CollectBtn>
      </div>
    </div>
    <div v-else>
      <el-icon class="mr-5" color="#f17f42"><InfoFilled /></el-icon>
      您还未收藏应用
    </div>
  </el-popover>
</template>

<script setup>
import { useCollectStore } from '@/store/collect'
import CollectBtn from '@/components/CollectBtn.vue'

const collectStore = useCollectStore()
collectStore.getList()

function removeSuccess(i) {
  collectStore.list.splice(i, 1)
}
</script>

<style lang="stylus" scoped>
.p-row
  padding 5px 0
</style>
