<template>
  <div class="p-toolbar" :class="{ 'u-theme-black': theme === 'black' }">
    <div class="u-row">
      <el-space :size="20" spacer="|">
        <!-- Pod Name -->
        <div>Pod：{{ podName }}</div>
        <!-- 连接状态 -->
        <div>
          <span>连接状态：</span>
          <el-tag v-if="connectStatus === 'OPEN'" type="success" size="small">
            {{ connectStatus }}
          </el-tag>
          <el-tag v-else type="info" size="small">{{ connectStatus }}</el-tag>
        </div>
      </el-space>
    </div>
    <div class="u-row">
      <el-space :size="20" spacer="|">
        <!-- 初始行数 -->
        <div>
          <span>初始行数：</span>
          <el-input
            style="width: 60px"
            placeholder=" "
            size="small"
            v-model="formData.tailLine"
            @keyup.enter="trigger('restart')"
          ></el-input>
        </div>
        <!-- 自动滚动 -->
        <span class="flex items-center">
          <span class="u-label">自动滚动：</span>
          <el-switch
            v-model="formData.autoScroll"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="trigger('autoScroll')"
          />
        </span>
        <!-- 置顶 -->
        <el-link
          class="font-12"
          type="primary"
          icon="Top"
          :underline="false"
          @click="trigger('toTop')"
        >
          置顶
        </el-link>
        <!-- 置底 -->
        <el-link
          class="font-12"
          type="primary"
          icon="Bottom"
          size="small"
          :underline="false"
          @click="trigger('toBottom')"
        >
          置底
        </el-link>
        <!-- 段落换行 -->
        <div>
          <span class="u-label">段落换行：</span>
          <el-switch
            v-model="formData.lineFeed"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="trigger('changeLineFeed')"
          />
        </div>
        <!-- 全屏 -->
        <div>
          <span class="u-label">全屏：</span>
          <el-switch
            v-model="formData.fullScreen"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="trigger('changeFullScreen')"
          />
        </div>
        <!-- 返回应用 -->
        <el-link
          class="font-12"
          type="primary"
          icon="Back"
          :underline="false"
          @click="trigger('back')"
        >
          返回应用
        </el-link>
        <!-- 清空 -->
        <el-link
          class="font-12"
          type="primary"
          icon="Delete"
          :underline="false"
          @click="trigger('clear')"
        >
          清空
        </el-link>
      </el-space>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { deepCopy } from '@/utils/util'

const props = defineProps({
  defaultTailLine: {
    type: Number,
    default: 10,
  },
  defaultAutoScroll: {
    type: Boolean,
    default: false,
  },
  defaultFullScreen: {
    type: Boolean,
    default: false,
  },
  defaultLineFeed: {
    type: Boolean,
    default: false,
  },
  podName: {
    type: String,
    default: '',
  },
  // 主题
  theme: {
    type: String,
    default: 'white', // white或black
  },
  // 连接状态
  connectStatus: {
    type: String,
  },
})

const emit = defineEmits(['trigger'])

const formData = reactive({
  tailLine: props.defaultTailLine,
  autoScroll: props.defaultAutoScroll,
  fullScreen: props.defaultFullScreen,
  lineFeed: props.defaultLineFeed,
})

function trigger(type) {
  if (type === 'fullScreen') formData.fullScreen = !formData.fullScreen
  emit('trigger', type, deepCopy(formData))
}
</script>

<style lang="stylus" scoped>
.p-toolbar
  font-size 12px
  color var(--el-text-color-primary)
  &.u-theme-black
    background-color black
    color #bbb
    .u-row
      border-bottom-color #bbb
  .u-row
    display flex
    align-items center
    padding 0 20px
    height 32px
    border-bottom 1px solid var(--el-border-color)
</style>
