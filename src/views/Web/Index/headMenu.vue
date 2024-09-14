<template>
  <div class="p-head-menu flex items-center">
    <AppSelect
      class="mr-50"
      placeholder="搜索应用"
      ref="appSelectRef"
      @changeApp="changeApp"
    ></AppSelect>
    <el-menu
      class="h-full"
      mode="horizontal"
      background-color="#000"
      text-color="#F17F42"
      active-text-color="#eab192"
      :ellipsis="false"
      :default-active="currentMenu"
      @select="clickMenu"
    >
      <el-menu-item index="wdsc">
        <CollectMenuItem></CollectMenuItem>
      </el-menu-item>
      <el-sub-menu popper-class="p-haed-menu-submenu" index="user">
        <template #title>
          <el-icon>
            <UserFilled />
          </el-icon>
          <span>{{ userStore.username }}</span>
        </template>
        <el-menu-item index="logout">退出</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import useMenu from '@/hooks/useMenu'
import CollectMenuItem from './collectMenuItem.vue'
import AppSelect from '@/components/AppSelect.vue'
import { ref } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const appSelectRef = ref()

const { selectMenu, currentMenu } = useMenu()

function logout() {
  userStore.setData({ token: '' })
  router.push({ name: 'login' })
}

function clickMenu(index) {
  if (index === 'logout') {
    logout()
  } else if (index) {
    selectMenu(index)
  }
}

function changeApp() {
  appSelectRef.value.setAppId(undefined)
}
</script>

<style lang="stylus" scoped>
.p-head-menu
  :deep(.el-menu--horizontal)
    border: none
</style>

<style>
.p-haed-menu-submenu {
  width: 120px;
  overflow: hidden;
}

.p-haed-menu-submenu .el-menu--popup {
  min-width: 120px;
}
</style>
