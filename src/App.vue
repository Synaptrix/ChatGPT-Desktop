<script setup lang="ts">
const { isFix } = storeToRefs(useSettingsStore())

const { windowClass } = useInit()

const handleDoubleClick = () => {
  isFix.value = !isFix.value
}
</script>

<template>
  <div
    class="frosted flex h-screen flex-col overflow-hidden p-2"
    :class="[windowClass]"
  >
    <a-tooltip :content="isFix ? '双击取消固定' : '双击固定窗口'">
      <div
        class="z-999 transition-300 fixed top-2 left-1/2 h-3 w-80 -translate-x-1/2 cursor-move rounded-md opacity-0 hover:opacity-100"
        :class="isFix ? 'bg-gray' : 'bg-gray/50'"
        data-tauri-drag-region
        @dblclick="handleDoubleClick"
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
