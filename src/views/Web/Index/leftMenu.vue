<template>
  <div class="h-full flex flex-col">
    <!-- 菜单 -->
    <el-menu
      class="p-left-menu flex-1 br-6"
      :default-active="currentMenu"
      :collapse="userStore.isCollapse"
      @select="selectMenu"
    >
      <template v-for="menuItem in leftMenuList">
        <template v-if="menuItem.hide !== true">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="menuItem.children > 0" :index="menuItem.index">
            <el-icon v-if="menuItem.icon">
              <component :is="menuItem.icon"></component>
            </el-icon>
            <template #title>
              <span>{{ menuItem.title }}</span>
            </template>
            <!-- 子菜单-菜单项 -->
            <el-menu-item-group>
              <el-menu-item
                v-for="menuSubItem in menuItem.children"
                :index="menuSubItem.index"
              >
                {{ menuSubItem.title }}
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <!-- 无子菜单 -->
          <el-menu-item v-else :index="menuItem.index">
            <el-icon v-if="menuItem.icon">
              <component :is="menuItem.icon"></component>
            </el-icon>
            <template #title>
              <span>{{ menuItem.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <!-- 折叠 -->
    <div
      class="p-collapse flex items-center justify-center cursor-pointer"
      @click="clickCollapse"
    >
      <template v-if="userStore.isCollapse">
        <el-icon><DArrowRight /></el-icon>
      </template>
      <template v-else>
        <el-icon><DArrowLeft /></el-icon>
        <span>折叠</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import useMenu from '@/hooks/useMenu'
import { useUserStore } from '@/store/user'
import { getLeftMenuList } from './menuList'

const leftMenuList = getLeftMenuList()

const { selectMenu, currentMenu } = useMenu()

const userStore = useUserStore()

function clickCollapse() {
  userStore.setData({
    isCollapse: !userStore.isCollapse,
  })
}
</script>

<style scoped lang="stylus">
.p-left-menu
  width 200px
  border-right 0

.p-collapse
  height 40px
  border-top 1px solid var(--el-border-color)
  color var(--el-text-color-primary)
  text-align center
  &:hover
    color var(--el-color-primary)

:deep(.el-menu--collapse)
  width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2)
</style>
