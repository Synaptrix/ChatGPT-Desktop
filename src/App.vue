<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
const { isFix } = storeToRefs(useSettingsStore())

const { windowClass } = useInit()

const { t } = i18n.global

const handleDoubleClick = (event: MouseEvent) => {
  event.preventDefault()

  isFix.value = !isFix.value
}

const handleMouseDown = () => {
  requestAnimationFrame(() => {
    appWindow.startDragging()
  })
}
</script>

<template>
  <div
    class="frosted flex h-screen flex-col overflow-hidden p-2"
    :class="[windowClass]"
  >
    <a-tooltip
      :content="
        isFix ? t('tips.doubleClickToFixed') : t('tips.doubleClickToFixed')
      "
    >
      <div
        class="z-999 transition-300 fixed left-1/2 top-2 h-3 w-80 -translate-x-1/2 cursor-move rounded-md opacity-0 hover:opacity-100"
        :class="isFix ? 'bg-gray' : 'bg-gray/50'"
        @dblclick="handleDoubleClick"
        @mousedown="handleMouseDown"
      ></div>
    </a-tooltip>

    <!-- 会话信息 -->
    <Session />

    <div class="flex cursor-default flex-col gap-2 pt-2">
      <!-- 功能区域 -->
      <Function />
      <!-- 输入框 -->
      <Input />
    </div>

    <!-- 设置界面 -->
    <Settings />

    <!-- 更新 -->
    <Update />
  </div>
</template>
