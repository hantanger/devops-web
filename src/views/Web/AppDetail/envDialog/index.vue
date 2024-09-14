<template>
  <el-dialog
    :title="dialogTitle"
    width="1000px"
    :model-value="visible"
    @close="close"
    @opened="opened"
  >
    <el-form
      ref="formRef"
      label-width="150px"
      :model="formData"
      :rules="formRules"
      v-loading="initLoading"
    >
      <el-tabs tab-position="left" v-model="activedTab">
        <!-- 构建参数 -->
        <el-tab-pane label="构建参数" name="tab1">
          <el-form-item label="环境" prop="envId">
            <el-select
              class="w-full"
              filterable
              :placeholder="' '"
              :disabled="mode === 'edit'"
              v-model="formData.envId"
            >
              <el-option
                v-for="item in envOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="环境分支" prop="routingMark">
            <el-input
              maxlength="20"
              disabled
              v-model="formData.routingMark"
            ></el-input>
          </el-form-item>

          <el-form-item label="Git分支" prop="gitBranch">
            <el-select
              class="w-full"
              filterable
              :placeholder="' '"
              :disabled="mode === 'create'"
              v-model="formData.gitBranch"
            >
              <el-option
                v-for="item in gitBranchOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Dockerfile模板" prop="buildDockerfileTemplateId">
            <el-select
              class="w-full"
              filterable
              :placeholder="' '"
              v-model="formData.buildDockerfileTemplateId"
            >
              <el-option
                v-for="item in dockfileTplOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="YAML模板" prop="deployYamlTemplateId">
            <el-select
              class="w-full"
              filterable
              :placeholder="' '"
              v-model="formData.deployYamlTemplateId"
            >
              <el-option
                v-for="item in yamlTplOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="构建代码指令" prop="buildCmd">
            <el-input v-model="formData.buildCmd"></el-input>
          </el-form-item>
          <el-form-item label="构建目录" prop="buildTarget">
            <el-input v-model="formData.buildTarget"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- Pod配置 -->
        <el-tab-pane label="Pod配置" name="tab2">
          <el-form-item label="Pod卷数据" prop="deployVolumes">
            <PodVolumeTable ref="deployVolumesRef"></PodVolumeTable>
          </el-form-item>
          <el-form-item label="Node亲和度" prop="deployNodeAffinity">
            <el-input
              type="textarea"
              v-model="formData.deployNodeAffinity"
            ></el-input>
          </el-form-item>
          <el-form-item label="副本数量" prop="deployReplicas">
            <el-input-number
              v-model="formData.deployReplicas"
            ></el-input-number>
          </el-form-item>
        </el-tab-pane>
        <!-- 容器参数 -->
        <el-tab-pane label="容器参数" name="tab3">
          <el-scrollbar height="400px">
            <div class="mr-10 overflow-x-hidden">
              <el-form-item label="启动命令" prop="containerCommand">
                <el-input
                  type="textarea"
                  v-model="formData.containerCommand"
                ></el-input>
              </el-form-item>
              <el-form-item label="启动参数" prop="containerCommandArgs">
                <el-input
                  type="textarea"
                  v-model="formData.containerCommandArgs"
                ></el-input>
              </el-form-item>
              <el-form-item label="端口配置" prop="containerAppPorts">
                <PortTable
                  ref="containerAppPortsRef"
                  @clickAdd="formRef.clearValidate('containerAppPorts')"
                  @clickDel="formRef.clearValidate('containerAppPorts')"
                ></PortTable>
              </el-form-item>
              <el-form-item label="环境参数" prop="containerEnvParams">
                <EnvConfigTable ref="containerEnvParamsRef"></EnvConfigTable>
              </el-form-item>
              <el-form-item label="资源参数" prop="containerResources">
                <ResourceTable ref="containerResourcesRef"></ResourceTable>
              </el-form-item>
              <el-form-item
                label="镜像获取策略"
                prop="containerImagePullPolicy"
              >
                <template #label="{ label }">
                  <div class="flex items-center">
                    <span>{{ label }}</span>
                    <el-tooltip
                      effect="dark"
                      content="Top Left prompts info"
                      placement="top"
                    >
                      <template #content>
                        <div>
                          Always：镜像标签为"latest"或镜像不存在时总是从指定的仓库中获取镜像
                        </div>
                        <div>
                          IfNotPresent: 仅当本地镜像缺失时方才从目标仓库下载镜像
                        </div>
                        <div>Never: 禁止从仓库下载镜像，即仅使用本地镜像</div>
                      </template>
                      <el-icon class="color-warning"><InfoFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-select
                  class="w-full"
                  placeholder=" "
                  v-model="formData.containerImagePullPolicy"
                >
                  <el-option
                    v-for="item in policyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="JVM参数" prop="containerJvm">
                <el-input
                  type="textarea"
                  v-model="formData.containerJvm"
                ></el-input>
              </el-form-item>
              <el-form-item label="存活探针" prop="containerLivenessProbe">
                <ProbeForm ref="containerLivenessProbeRef"></ProbeForm>
              </el-form-item>
              <el-form-item label="就绪探针" prop="containerReadinessProbe">
                <ProbeForm ref="containerReadinessProbeRef"></ProbeForm>
              </el-form-item>
              <el-form-item label="挂载卷" prop="containerVolumeMounts">
                <ContainerVolumeTable
                  ref="containerVolumeMountsRef"
                ></ContainerVolumeTable>
              </el-form-item>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <!-- 其他 -->
        <el-tab-pane label="其他" name="tab4">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <!-- <el-button plain :loading="loading" @click="resetFieldsAll">
        重置
      </el-button> -->
      <el-button plain :loading="loading" @click="emit('close')">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="clickSure">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup name="EnvDialog">
import { ref, toRefs, watch, computed } from 'vue'
import useForm from './useForm'
import useOptions from './useOptions'
import PodVolumeTable from './podVolumeTable.vue'
import PortTable from './portTable.vue'
import EnvConfigTable from './envConfigTable.vue'
import ProbeForm from './probeForm.vue'
import ResourceTable from './resourceTable.vue'
import ContainerVolumeTable from './containerVolumeTable.vue'

const props = defineProps({
  visible: Boolean,
  mode: String, // create 绑定环境并创建master环境分支； edit 编辑环境分支
  appId: String,
  branchId: Number,
  bindedEnvList: Array,
})

const { mode, appId, branchId, bindedEnvList } = toRefs(props)

const emit = defineEmits(['close', 'success'])

const formRef = ref()
const deployVolumesRef = ref() // Pod卷数据
const containerAppPortsRef = ref() // 端口配置
const containerEnvParamsRef = ref() // 环境参数
const containerResourcesRef = ref() // 资源参数
const containerLivenessProbeRef = ref() // 存活探针
const containerReadinessProbeRef = ref() // 就绪探针
const containerVolumeMountsRef = ref() // 就绪探针

const activedTab = ref('tab1')

// 表单
const {
  formData,
  formRules,
  loading,
  initLoading,
  submit,
  initDetail,
  resetFieldsAll,
} = useForm({
  formRef,
  deployVolumesRef,
  containerAppPortsRef,
  containerEnvParamsRef,
  containerResourcesRef,
  containerLivenessProbeRef,
  containerReadinessProbeRef,
  containerVolumeMountsRef,
  mode,
  appId,
  branchId,
})

// 下拉框option
const {
  envOptions,
  gitBranchOptions,
  dockfileTplOptions,
  yamlTplOptions,
  policyOptions,
  initOptions,
} = useOptions({
  appId,
  bindedEnvList,
})

const dialogTitle = computed(() => {
  const index = envOptions.value.findIndex(
    (item) => item.id === formData.value.envId
  )
  return `部署环境 ${index >= 0 ? envOptions.value[index].name : ''}`
})

// 点击确认
function clickSure() {
  submit(() => {
    // 提交成功后的回调
    emit('success')
  })
}

// 关闭对话框
function close() {
  // resetFieldsAll();
  emit('close')
  activedTab.value = 'tab1'
}

// 打开对话框
function opened() {
  if (mode.value === 'edit') {
    initDetail()
  } else {
    resetFieldsAll()
  }
}

watch(
  () => props.visible,
  (v) => {
    if (v) {
      initOptions()
    }
  }
)
</script>
