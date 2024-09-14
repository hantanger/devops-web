<template>
  <el-dialog
    width="1200px"
    :title="title"
    :model-value="visible"
    @close="emit('close')"
  >
    <el-tabs tab-position="left" v-model="activedTab">
      <!-- Dockerfile -->
      <el-tab-pane label="Dockerfile" name="dockerfile">
        <HighLight
          lang="dockerfile"
          :code="dockerfile || '- -'"
          v-loading="loading"
        ></HighLight>
      </el-tab-pane>
      <!-- Yaml -->
      <el-tab-pane label="Yaml" name="yaml">
        <HighLight
          lang="yaml"
          :code="yaml || '- -'"
          v-loading="loading"
        ></HighLight>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button type="primary" @click="emit('close')">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import HighLight from '@/components/HighLight.vue'

defineProps({
  title: {
    type: String,
    default: '查看配置',
  },
  loading: Boolean,
  visible: Boolean,
  dockerfile: String,
  yaml: String,
})

const emit = defineEmits(['close'])

const activedTab = ref('dockerfile')
</script>
