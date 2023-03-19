<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { initSQL } from '@/sqls'
import { useSettingsStore } from '@/stores'

const { themeClass, isFix } = storeToRefs(useSettingsStore())

const isLoading = ref(true)

// 窗口获取焦点状态
const windowFocused = ref(true)

onMounted(async () => {
  await initSQL()

  isLoading.value = false

  // 监听窗口有无获取焦点
  appWindow.onFocusChanged(({ payload }) => {
    if (!payload && !isFix.value) appWindow.hide()

    windowFocused.value = payload
  })
})
</script>

<template>
  <div
    class="frosted flex h-screen cursor-move flex-col overflow-hidden rounded-xl p-2"
    :class="[themeClass, windowFocused ? 'bordered' : 'bordered-transparent']"
    data-tauri-drag-region
  >
    <div class="flex h-full items-center justify-center" v-if="isLoading">
      <a-spin :size="50" :loading="true" />
    </div>

    <template v-else>
      <div class="text-7 fixed top-2 right-2 flex gap-2">
        <!-- 主题切换 -->
        <Theme />
        <!-- 固定窗口 -->
        <Fixed />
      </div>

      <!-- 会话信息 -->
      <Session />

      <div class="flex cursor-default flex-col gap-2 pt-2">
        <!-- 功能区域 -->
        <Function />
        <!-- 输入框 -->
        <Input />
      </div>
    </template>
  </div>
</template>
