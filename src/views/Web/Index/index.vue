<template>
  <div class="web-header flex px-10 items-stretch">
    <div class="web-logo"></div>
    <div class="flex-1"></div>
    <HeadMenu></HeadMenu>
  </div>
  <div class="web-main flex">
    <div class="web-left">
      <div class="web-menu bg-white br-6">
        <LeftMenu></LeftMenu>
      </div>
    </div>
    <div class="web-right flex-1">
      <el-scrollbar>
        <div class="web-body">
          <router-view :key="route.fullPath"></router-view>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup name="web">
import { useRoute } from 'vue-router'
import LeftMenu from './leftMenu.vue'
import HeadMenu from './headMenu.vue'

const route = useRoute()
</script>

<style lang="stylus" scoped>
.web-header
  height 40px
  background-color var(--color-1)
  color #fff
.web-main
  box-sizing border-box
  align-items: stretch
  width 100%
  height calc(100vh - 40px)
.web-left
  padding 10px 0 10px 10px
  overflow hidden
.web-logo
  padding-left 50px
  height 40px
  line-height 40px
  background url('/logo.jpg') left no-repeat
  background-size 40px
.web-right
  margin 10px 0
.web-body
  padding 0 10px

.web-menu
  height 100%
</style>
