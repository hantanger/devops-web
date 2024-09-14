<template>
  <canvas class="p-canvas" ref="canvasRef"></canvas>
  <div class="p-login-block mx-auto">
    <div class="u-logo"></div>
    <el-form class="mt-20" ref="formRef" :model="formData" :rules="formRules">
      <el-form-item prop="username">
        <el-input
          maxLength="20"
          placeholder="用户名"
          v-model="formData.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          maxLength="30"
          placeholder="密码"
          type="password"
          show-password
          v-model="formData.password"
          @keydown.enter="clickSubmit"
        ></el-input>
      </el-form-item>
      <div class="u-btn-wrap">
        <el-button
          class="block w-full"
          type="primary"
          :loading="submitLoading"
          @click="clickSubmit"
        >
          登录
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import useForm from './useForm'
import useStar from './useStar'

const formRef = ref()
const canvasRef = ref()

const { formData, formRules, submitLoading, clickSubmit } = useForm({
  formRef,
})

const { start, stop } = useStar(canvasRef)
onMounted(() => start())
onUnmounted(() => stop())
</script>

<style lang="stylus" scoped>
.p-canvas
  position fixed
  top 0
  left 0
  z-index -1
  background #0e1729
.p-login-block
  margin-top 200px
  padding 60px 20px
  width 300px
  border-radius 6px
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2)
  background var(--color-4)
  .u-logo
    height 100px
    background url('/logo.jpg') center no-repeat
    background-size contain

  .u-btn-wrap
    width 100%
</style>
