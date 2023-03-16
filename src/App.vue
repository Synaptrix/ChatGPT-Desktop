<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { initSQL } from '@/sqls'
import { useSettingsStore, useRoleStore } from '@/stores'

// TODO: 首次加载有问题，获取不到初始化的角色列表
initSQL()

const { themeClass, isFix } = storeToRefs(useSettingsStore())
const { currentRole } = storeToRefs(useRoleStore())

// 窗口获取焦点状态
const windowFocused = ref(true)

onMounted(async () => {
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
    <div class="text-7 fixed top-2 right-2 flex gap-2">
      <!-- 主题切换 -->
      <Theme />
      <!-- 固定窗口 -->
      <Fixed />
    </div>

    <!-- 会话信息 -->
    <Session />

    <div class="flex cursor-default flex-col gap-2 pt-2">
      <div class="text-6 relative flex justify-end gap-4">
        <!-- 当前聊天角色对象 -->
        <div class="top-50% left-50% text-4 -translate-1/2 absolute">
          正在与 <span class="mark">{{ currentRole?.name }}</span> 对话
        </div>
        <!-- 功能按钮 -->
        <Function />
      </div>
      <!-- 输入框 -->
      <Input />
    </div>
  </div>
</template>
